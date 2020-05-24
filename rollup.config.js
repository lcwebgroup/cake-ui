import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import ignore from 'rollup-plugin-ignore';

const devConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/cake-ui.development.js',
    format: 'umd',
    name: 'CakeUi',
    globals: {
      'prop-types': 'PropTypes',
      react: 'React',
    },
    sourcemap: true,
  },
  plugins: [
    commonjs({ exclude: 'src/**' }),
    nodeResolve(),
    babel({
      babelrc: false,
      presets: ['@babel/env', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  external: ['prop-types', 'react'],
};

const productionConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/cake-ui.production.min.js',
    format: 'umd',
    name: 'CakeUi',
    globals: {
      react: 'React',
    },
    sourcemap: true,
  },
  plugins: [
    ignore(['prop-types']),
    commonjs({ exclude: 'src/**' }),
    nodeResolve(),
    babel({
      presets: ['@babel/env'],
      plugins: ['transform-react-remove-prop-types', '@babel/plugin-proposal-export-default-from'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    uglify(),
  ],
  external: ['react'],
};

export default [devConfig, productionConfig];
