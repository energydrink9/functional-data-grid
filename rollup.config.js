import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import { eslint } from 'rollup-plugin-eslint'
import autoExternal from 'rollup-plugin-auto-external';

export default [
	// browser-friendly UMD build
	{
    input: 'src/main.js',
		output: {
			name: 'FunctionalDataGrid',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
      autoExternal(),
      eslint({
        exclude: ['node_modules/**'],
        throwOnError: true
      }),
      babel({
        babelrc: true,
        externalHelpers: true,
        exclude: ['node_modules/**'],
        plugins: ['@babel/external-helpers']
      }),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/immutable/dist/immutable.js': [ 'Map', 'List', 'OrderedMap' ],
          'node_modules/react-dom/index.js': [ 'findDOMNode' ]
        }
      })
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
    ],
    plugins: [
      autoExternal(),
      eslint({
        exclude: ['node_modules/**'],
        throwOnError: true
      }),
      babel({
        babelrc: true,
        externalHelpers: true,
        exclude: ['node_modules/**'],
        plugins: ['@babel/external-helpers']
      }),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/immutable/dist/immutable.js': [ 'Map', 'List', 'OrderedMap' ],
          'node_modules/react-dom/index.js': [ 'findDOMNode' ]
        }
      })
		]
	}
];