const NodeMediaServer = require('node-media-server');
let config = require('./config/env/env');

function startMediaServer() {
    let nms = new NodeMediaServer(config.configStream);
    nms.run();

    nms.on('postPublish', (id, StreamPath, args) => {
        console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

        const { exec } = require('child_process');
        exec('ffmpeg -v verbose -i rtmp://188.166.29.146/live/test -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 10 -hls_list_size 6 -hls_wrap 10 -start_number 1 /home/stream/public_html/test/index.m3u8', (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                return;
            }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

    });


}



module.exports = {
    start: function () {
        startMediaServer()
    }
};