// require("dotenv").config();
// const mysql = require("mysql2");
// const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
// const connection = mysql.createConnection({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
// });
// try {
//   connection.connect((error) => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
//   });
// } catch (error) {
//   console.log("error", error);
// }

// module.exports = connection;


const mongoose = require('mongoose');
const Connection = (username, password) => {

    // const URL = `mongodb+srv://${username}:${password}@cluster0.wp4chqh.mongodb.net/yuvabitcoin`
    const URL = `mongodb+srv://${username}:${password}@yuvabitcoin.x9wljy5.mongodb.net/YuvaBitCoin`

    try {
        mongoose.connect(URL);
        console.log("=== Database Connected Successfully ===");
    } catch (error) {
        console.log("Error in Database Connection", error);
    };
};

module.exports = { Connection };
