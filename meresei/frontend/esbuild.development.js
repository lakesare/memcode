import esbuild from "esbuild";
import { sassPlugin } from 'esbuild-sass-plugin';

let ctx = await esbuild.context({
  entryPoints: ["index.tsx"],
  bundle: true,
  outfile: "dist/index.js",
  sourcemap: true,
  platform: "browser",
  loader: {
    ".json": "json",
    ".css": "css",
  },
  plugins: [sassPlugin()],
  logLevel: "info",
  logLimit: 0,
});

await ctx.watch();
