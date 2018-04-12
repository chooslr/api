const type = 'v1'
require('../rollup.config.module.js')(type)
.then(() => require('../rollup.config.umd.js')(type, 'tumblrV1'))