let env = {
        webPort: process.env.PORT || 3000,
        dbHost: process.env.DB_HOST || 'localhost',
        dbPassword: process.env.DB_PASSWORD || '',
        dbDatabase: process.env.DB_DATABASE || 'value'
    };

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase;

module.exports = {
    env: env,
    dburl: dburl
};
