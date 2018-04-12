const type = 'v2'
require('../rollup.config.module.js')(type)
.then(() => require('../rollup.config.umd.js')(type, 'tumblrV2'))