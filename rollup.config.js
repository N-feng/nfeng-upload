import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { babel } from "@rollup/plugin-babel"
import vue from "rollup-plugin-vue"
import { terser } from "rollup-plugin-terser"
import postcss from "rollup-plugin-postcss"
import sass from "node-sass"

const babelOptions = {
  "presets": ['@babel/preset-env'],
}

const isDev = process.env.NODE_ENV !== 'production';

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

const config = {
  input: "./src/index.js",
  output: {
    file: './dist/index.umd.js',
    format: 'umd',
    name: 'App'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(babelOptions),
    vue({
      css: true,
      compileTemplate: true
    }),
    !isDev && terser(),
    postcss({
      extract: true,
      minimize: !isDev,
      extensions: ['css', 'scss'],
      process: processSass,
    })
  ],
  external: ['nfeng-axios']
}

export default config