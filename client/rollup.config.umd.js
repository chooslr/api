const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

module.exports = (type, name) =>
  rollup({
    input: `client/.src/${type}/index.js`,
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      resolve(),
      commonjs(),
      uglify({}, minify)
    ]
  })
    .then(bundle => bundle.write({ format: 'umd', file: `client/${type}/umd.js`, name }))
    .catch(err => console.error(err))