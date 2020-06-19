const mysql = require("mysql2");
const dbsecret = require("../config/db.json");
const pool = mysql.createPool(
  dbsecret
  //   waitForConnections: true,
  //   connectionLimit: 10,
  //   queueLimit: 0,
  //
);
const promisePool = pool.promise();
module.exports = promisePool;
