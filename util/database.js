var mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "emi128",
});

module.exports = pool.promise();

// var con = mysql.createConnection({
//   host: localhost,
//   user: myusername,
//   password: mypassword,
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
