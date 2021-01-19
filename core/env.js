module.exports = {
    PORT: process.env.PORT || 3201,
    database: {
        credentials: {
            host: process.env.DB_HOST || 'localhost', //process.env.DB_HOST
            user: process.env.DB_USER || 'root',  //process.env.DB_USER
            password: process.env.DB_PASS || '', //process.env.DB_PASS
            port: process.env.DB_PORT || 3306, //process.env.DB_PORT
            database: process.env.DB_NAME || 'puppeteer_map_db', //process.env.DB_NAME,
            insecureAuth: true
        },
        queueTableName: 'queue',
        visitTableName: 'visit',
        logTableName: 'log'
    }
}