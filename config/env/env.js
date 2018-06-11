let env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'user',
    secret: process.env.SECRET || 'YouHaveFailedThisCity'
};

let configStream = {
    logType: 3,
    rtmp: {
        port: 1935,
        chunk_size: 6000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http:{
        port: 8000,
        allow_origin: '*'
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