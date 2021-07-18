const path = require('path');
const buble = require('@rollup/plugin-buble');
const { babel } = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const vue = require('rollup-plugin-vue');
const css = require('rollup-plugin-css-only');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const sass = require('node-sass');

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath)
}

const isProductionEnv = process.env.NODE_ENV === 'production';

const babelOptions = {
  "presets": ['@babel/preset-env'],
}

const processSass = function (context, payload) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: context
    }, function (err, result) {
      if (!err) {
        resolve(result);
      } else {
        reject(err)
      }
    });
  })
}

module.exports = [
  {
    input: resolveFile('src/index.js'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'esm',
      name: 'App'
    },
    plugins: [
      vue({ css: false }),
      css(),
      nodeResolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      postcss({
        extract: true,
        minimize: isProductionEnv,
        extensions: ['css', 'scss'],
        process: processSass,
      }),
      babel(babelOptions),
      buble({
        objectAssign: 'Object.assign',
        transforms: {
          // make async/await work by default (no transforms)
          asyncAwait: false,
        },
      }),
    ],
  },
]