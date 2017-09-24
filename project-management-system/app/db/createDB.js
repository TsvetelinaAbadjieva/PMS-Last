var mysql = require('mysql');

var con = mysql.createConnection({
  host:     "localhost",
  user:     "root",
  password: "root"

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  /*Create a database named "mydb":*/
  con.query("CREATE DATABASE project_management_system", function (err, result) {
    if (err) throw err;
    console.log("Database PMS created");
  });
});
