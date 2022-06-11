import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js', // 打包入口
  output: [
    {
      file: 'lib/sparrow.js', // 对于nodejs，打包成commonjs
      fromat: 'cjs',
    },
    {
      file: 'esm/sparrow.js', // 浏览器，打包成ES module
      fromat: 'es',
    },
    {
      file: 'dist/sparrow.min.js', // 混合打包
      name: 'sp',
      fromat: 'umd',
    },
  ],
  plugins: [
    resolve(),
    babel(),
  ],
};
