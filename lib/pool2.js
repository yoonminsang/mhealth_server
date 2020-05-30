var mysql = require("mysql2");
var dbsecret = require("../config/db.json");
const pool = mysql.createPool(
  dbsecret
  //   waitForConnections: true,
  //   connectionLimit: 10,
  //   queueLimit: 0,
  //
);
module.exports = pool;
