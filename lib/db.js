var mysql = require("mysql2");
var dbsecret = require("../config/db.json");
var db = mysql.createConnection(dbsecret);
db.connect();
module.exports = db;
