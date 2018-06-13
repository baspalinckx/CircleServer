let env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'user',
    secret: process.env.SECRET || 'YouHaveFailedThisCity'
};

const ffmpegSrc = process.platform=== 'win32'?
    './config/ffmpeg.exe':
    '../../../usr/ffmpeg';

console.log(ffmpegSrc);

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


let configStream = {
    logType: 3,
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http:{
        port: 8000,
        allow_origin: '*'
    },
    https:{
        port: 8443,
        key: './privatekey.pem',
        cert: './certificate.pem'
    },
    trans: {
        ffmpeg: ffmpegSrc,
        tasks: [
            {
               /* port: 5000,*/
                app: 'live',
                ac: 'aac',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                /*mp4: true,
                mp4Flags: '[movflags=faststart]'*/
            }
        ]
    }

};

let dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase;

module.exports = {
    env: env,
    dbURL: dburl,
    configStream: configStream
};