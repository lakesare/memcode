const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('../env.js');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'webpackedFiles');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy non-webpack files
const copyFiles = (srcDir, destDir) => {
  if (!fs.existsSync(srcDir)) return;
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Copy non-webpack files
copyFiles(path.join(__dirname, 'nonWebpackedFiles'), outputDir);

const buildConfig = {
  entryPoints: ['./index.js'],
  bundle: true,
  outdir: outputDir,
  entryNames: 'index_2',
  format: 'iife',
  target: ['es2015'],
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'global': 'window'
  },
  inject: [path.resolve(__dirname, 'esbuild-shims.js')],
  loader: {
    '.js': 'jsx',
    '.png': 'file',
    '.jpg': 'file',
    '.gif': 'file',
    '.svg': 'file',
    '.mp3': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file'
  },
  alias: {
    '~': path.resolve(__dirname, './')
  },
  external: [],
  plugins: [
    sassPlugin({
      type: 'css',
      cssImports: true,
      loadPaths: [path.resolve(__dirname, '../node_modules')]
    }),
    {
      name: 'resolve-node-modules',
      setup(build) {
        // Handle font-awesome fonts path
        build.onResolve({ filter: /^~font-awesome/ }, args => {
          const relativePath = args.path.replace(/^~/, '');
          return { path: path.resolve(__dirname, '../node_modules', relativePath) };
        });
      }
    }
  ]
};

const isDevelopment = process.env.NODE_ENV === 'development';
const isWatch = process.argv.includes('--watch');

if (isDevelopment) {
  buildConfig.minify = false;
} else {
  buildConfig.minify = true;
}

async function build() {
  try {
    if (isWatch) {
      const context = await esbuild.context(buildConfig);
      await context.watch();
      console.log('👀 Watching for changes...');
    } else {
      const result = await esbuild.build(buildConfig);
      console.log('✅ Build completed successfully');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
