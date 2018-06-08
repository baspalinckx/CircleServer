/*const NodeMediaServer = require('node-media-server');*/
const express = require('express');
const routes = express.Router();

/*const config = {
    logType: 3,
    rtmp: {
        port: 1935,
        chunk_size: 6000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    }
};
var nms = new NodeMediaServer(config);

routes.post('', function(req, res) {
    console.log('test');
  nms.run();
  res.status(200).json({
      "test": "test"
  })
});*/

module.exports = routes;