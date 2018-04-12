const { rollup } = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

module.exports = (type) =>
  rollup({
    input: `client/.src/${type}/index.js`,
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      commonjs()
    ]
  })
    .then(bundle => {
      bundle.write({ format: 'cjs', file: `client/${type}/cjs.js` })
      bundle.write({ format: 'es', file: `client/${type}/es.js` })
    })
    .catch(err => console.error(err))