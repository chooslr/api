const { rollup } = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

module.exports = (type) =>
  rollup({
    input: `.src/${type}.js`,
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      commonjs()
    ]
  })
    .then(bundle => {
      bundle.write({ format: 'cjs', file: `${type}/cjs.js` })
      bundle.write({ format: 'es', file: `${type}/es.js` })
    })
    .catch(err => console.error(err))