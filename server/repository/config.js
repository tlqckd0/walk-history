module.exports = {
    host: 'localhost',
    user: 'root',
    database: 'walkgps',
    password: process.env.MYSQL_PASSWORD,
    dateStrings:true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}
