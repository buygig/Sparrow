import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js', // 打包入口
  output: [
    {
      file: 'lib/sparrow.js', // 对于nodejs，打包成commonjs
      format: 'cjs',
    },
    {
      file: 'esm/sparrow.mjs', // ES module
      format: 'es',
    },
    {
      file: 'dist/sparrow.js', // 浏览器全局 sp
      name: 'sp',
      format: 'umd',
    },
  ],
  plugins: [
    resolve(),
    babel(),
  ],
};
