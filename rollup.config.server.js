import babel from 'rollup-plugin-babel'
import external from 'rollup-plugin-auto-external'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

export default {
  input: 'src/server.js',
  output: { format: 'cjs', file: 'server/index.js' },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    external({ builtins: true, dependencies: true }),
    uglify({}, minify)
  ]
}