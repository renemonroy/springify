import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'demo/index.js',
  output: { file: 'demo/public/bundle.js', format: 'iife', name: 'springify' },
  plugins: [
    resolve(),
    commonjs(),
    buble()
  ]
};
