import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { source, main } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const filterFalsies = (arr) => arr.filter(x => !!x);

export default {
  input: source,
  output: { file: main, format: 'umd', name: 'myAppName' },
  plugins: filterFalsies([
    resolve(),
    commonjs(),
    buble(),
    isProduction && uglify()
  ])
};
