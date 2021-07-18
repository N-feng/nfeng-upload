import resolve from "rollup-plugin-node-resolve"
import vue from "rollup-plugin-vue"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
// import image from "@rollup/plugin-image"

const config = {
  input: "./src/index.js", // 必须，入口文件
  output: { // 必须，输出文件 (如果要输出多个，可以是一个数组)
    file: './dist/index.umd.js',
    format: 'umd',
    name: 'App'
  },
  plugins: [ // 引入的插件在这里配置
    resolve(),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      exclude: "**/node_modules/**"
    }),
    commonjs(),
    // image()
  ]
}

export default config