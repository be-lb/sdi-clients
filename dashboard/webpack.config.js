
const { resolve } = require('path');
const configure = require('../webpack.base');
module.exports = configure(resolve(__dirname), `/client/assets/default/`);
