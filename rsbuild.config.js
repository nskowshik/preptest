import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import rspack from '@rspack/core';

export default defineConfig({
  plugins: [pluginReact(),pluginSvgr()],
  source: {
    entry: {
      index: './src/index.jsx',
    },
  },
  html: {
    template: './public/index.html',
  },
  tools: {
    rspack: {
      plugins: [new rspack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      })],
    },
    cssPostcss: true,
  },
});
