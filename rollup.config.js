import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import { uglify } from 'rollup-plugin-uglify';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'lib/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [typescript(), babel(), postcss(), filesize(), isProd && uglify()],
  external: ['react']
};
