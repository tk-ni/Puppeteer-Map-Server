module.exports = {
    PORT: process.env.PORT || 3201,
    database: {
        credentials: {
            host: 'localhost', //process.env.DB_HOST
            user: 'root',  //process.env.DB_USER
            password: '', //process.env.DB_PASS
            port: '3306', //process.env.DB_PORT
            database: 'puppeteer_map_db', //process.env.DB_NAME,
            insecureAuth: true
        },
        queueTableName: 'queue',
        visitTableName: 'visit'
    }
}