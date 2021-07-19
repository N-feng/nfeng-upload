import resolve from "rollup-plugin-node-resolve"
import vue from "rollup-plugin-vue"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"

const isDev = process.env.NODE_ENV !== 'production';

const config = {
  input: "./src/index.js",
  output: {
    file: './dist/index.umd.js',
    format: 'umd',
    name: 'App'
  },
  plugins: [
    resolve(),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      exclude: "**/node_modules/**",
    }),
    commonjs(),
    !isDev && terser()
  ]
}

export default config