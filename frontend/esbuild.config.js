import esbuild from 'esbuild';
import * as sass from 'sass';
import { injectManifest } from 'workbox-build';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
import '../env.js';

const outputDir = path.join(__dirname, 'webpackedFiles');
const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.argv.includes('--watch');

// Clean old files on each build to prevent accumulation of old precache manifests
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// copies subfoldered files directly into /webpackedFiles
const copyFiles = (srcDir, destDir) => {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach((file) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};
copyFiles(path.join(__dirname, 'nonWebpackedFiles'), outputDir);

// allows to import from the deep nested folders:
// instead of: import '../../../../../services',
// import '~/services'
// idea from http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack#comment60353452_35047907
const expandTilde = (importPath) => (
  importPath.startsWith('~/') ?
    path.join(__dirname, importPath.slice(2)) :
    path.join(__dirname, '../node_modules', importPath.slice(1))
);

const tildeResolver = {
  name: 'tilde-resolver',
  setup(build) {
    // hand the rewritten path back to esbuild so it still applies extension and /index resolution
    build.onResolve({ filter: /^~/ }, (args) => {
      const expanded = expandTilde(args.path);
      return build.resolve(expanded, { kind: args.kind, resolveDir: path.dirname(expanded) });
    });
  }
};

// ___Why compile sass by hand instead of esbuild-sass-plugin?
//    the plugin can only emit esbuild's plain 'css' loader, and this app needs 'global-css' -
//    class names stay global unless wrapped in :local(), which is what `import css from './index.scss'` reads.
const sassCompiler = {
  name: 'sass',
  setup(build) {
    build.onLoad({ filter: /\.s[ac]ss$/ }, (args) => {
      const result = sass.compile(args.path, {
        loadPaths: [path.join(__dirname, '../node_modules')],
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
        importers: [{
          findFileUrl: (url) => (url.startsWith('~') ? pathToFileURL(expandTilde(url)) : null)
        }]
      });
      return {
        contents: result.css,
        loader: 'global-css',
        resolveDir: path.dirname(args.path)
      };
    });
  }
};

const loader = {
  '.js': 'jsx',
  '.json': 'json',
  '.png': 'file',
  '.jpg': 'file',
  '.jpeg': 'file',
  '.gif': 'file',
  '.svg': 'file',
  '.mp3': 'file',
  '.woff': 'file',
  '.woff2': 'file',
  '.ttf': 'file',
  '.otf': 'file',
  '.eot': 'file'
};

const buildConfig = {
  entryPoints: [path.join(__dirname, 'index.js')],
  bundle: true,
  outdir: outputDir,
  entryNames: 'index_2',
  assetNames: '[name]',
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  minify: isProduction,
  publicPath: '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'window'
  },
  inject: [path.join(__dirname, 'esbuild-shims.js')],
  loader,
  plugins: [
    tildeResolver,
    sassCompiler
  ],
  logLevel: 'info',
  logLimit: 0
};

// ___Why is the service worker built separately?
//    esbuild bundles it (workbox-* are npm imports, not a CDN global), then workbox-build swaps
//    self.__WB_MANIFEST for the real precache manifest - which can only be computed once every
//    other file is already written to /webpackedFiles.
const buildServiceWorker = async () => {
  const bundledSwPath = path.join(outputDir, 'service-worker.bundled.js');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'service-worker.js')],
    bundle: true,
    outfile: bundledSwPath,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    minify: isProduction,
    define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') },
    logLevel: 'info'
  });

  // places it into /webpackedFiles/webpacked-service-worker.js,
  // useless-subdirectory is needed for node'd express.static() route.
  const { count, warnings } = await injectManifest({
    swSrc: bundledSwPath,
    swDest: path.join(outputDir, 'webpacked-service-worker.js'),
    globDirectory: outputDir,
    globPatterns: ['**/*.{js,css,png,jpg,gif,svg,ico,mp3,woff,woff2,ttf,otf,eot,xml,webmanifest}'],
    globIgnores: ['**/*.map', 'service-worker.bundled.js', 'webpacked-service-worker.js'],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
  });
  warnings.forEach((warning) => console.warn(warning));
  fs.rmSync(bundledSwPath, { force: true });
  fs.rmSync(`${bundledSwPath}.map`, { force: true });
  console.log(`service worker: precaching ${count} files`);
};

if (isWatch) {
  const context = await esbuild.context(buildConfig);
  await context.rebuild();
  await buildServiceWorker();
  await context.watch();
  console.log('👀 Watching for changes...');
} else {
  await esbuild.build(buildConfig);
  await buildServiceWorker();
  console.log('✅ Build completed successfully');
}
