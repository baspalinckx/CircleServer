const NodeMediaServer = require('node-media-server');
let config = require('./config/env/env');

function startMediaServer() {
    let nms = new NodeMediaServer(config.configStream);
    nms.run();
}

module.exports = {
    start: function () {
        startMediaServer()
    }
};