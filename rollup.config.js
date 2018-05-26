import babel from 'rollup-plugin-babel'
import external from 'rollup-plugin-auto-external'
import prettier from 'rollup-plugin-prettier'

const plugins = (babelOpts) => [
  babel(Object.assign({ babelrc: false, exclude: 'node_modules/**' }, babelOpts)),
  external({ builtins: true, dependencies: true }),
  prettier({ tabWidth: 2, semi: false, singleQuote: true })
]

export default [
  {
    input: 'src/client.js',
    output: [
      { format: 'cjs', file: 'client/cjs.js', exports: 'named' },
      { format: 'es', file: 'client/es.js', exports: 'named' },
    ],
    plugins: plugins({ presets: [['env', { modules: false }]], plugins: ['external-helpers'] })
  },
  {
    input: 'src/server.js',
    output: { format: 'cjs', file: 'server/index.js' },
    plugins: plugins({ presets: [['env', { modules: false, targets: { node: "8" } }]] })
  }
]