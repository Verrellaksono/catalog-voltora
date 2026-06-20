const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST_SECRET,
    user: process.env.DB_USER_SECRET,
    password: process.env.DB_PASSWORD_SECRET,
    database: process.env.DB_DATABASE_SECRET,
});

module.exports = db;
