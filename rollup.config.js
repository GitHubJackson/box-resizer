import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: {
    // file: "cjs.js",
    // format: "cjs",
    file: './lib/index.js',
    format: 'esm'
  },
  plugins: [typescript(), babel(), postcss()],
  external: ['react']
};
