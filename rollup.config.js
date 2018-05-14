import babel from 'rollup-plugin-babel'
import external from 'rollup-plugin-auto-external'
import prettier from 'rollup-plugin-prettier'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

export default [
  {
    input: 'src/client.js',
    output: [
      { format: 'cjs', file: 'client/cjs.js', exports: 'named' },
      { format: 'es', file: 'client/es.js', exports: 'named' },
    ],
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      external({ builtins: true, dependencies: true }),
      prettier({ tabWidth: 2, semi: false, singleQuote: true })
    ]
  },
  {
    input: 'src/server.js',
    output: { format: 'cjs', file: 'server/index.js' },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      external({ builtins: true, dependencies: true }),
      uglify({}, minify)
    ]
  }
]