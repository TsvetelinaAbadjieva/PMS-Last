var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "project_management_system"
});

con.connect(function (err) {

  if (err) throw err;
  console.log("Connected!");
  /*
  CREATE TABLE `project_management_system`.`user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(45) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`));
*/
  var sqlUser = "CREATE TABLE user (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,   first_name VARCHAR(255) NOT NULL,  last_name VARCHAR(255) NOT NULL, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255))";
  /*  CREATE TABLE `project_management_system`.`project` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `title` VARCHAR(255) NULL,
     pr_start_date DATE NULL,`pr_due_date` DATE NULL,
      `description` VARCHAR(500) NULL,
      PRIMARY KEY (`id`));
  */
  var sqlProject = "CREATE TABLE project (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id INT(11) NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255), pr_start_date DATE NOT NULL, pr_due_date DATE NOT NULL) ;";
  /*  CREATE TABLE `project_management_system`.`section` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `title` VARCHAR(255) NULL,
     `project_id` INT NOT NULL, PRIMARY KEY (`id`))
     ENGINE = InnoDB
     DEFAULT CHARACTER SET = utf8;
  */

  var sqlSection = "CREATE TABLE section (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255))";
  /*  CREATE TABLE `project_management_system`.`task` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `user_id` INT NOT NULL,
      `project_id` INT NOT NULL,
      `section_id` INT NOT NULL,
      `status_id` INT NOT NULL,
      `task` VARCHAR(255) NULL,
      `description` VARCHAR(255) NULL,
     `start_date` DATE NULL, `due_date` DATE NULL,
      PRIMARY KEY (`id`));
      */
  var sqlTask = "CREATE TABLE task (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id INT(11) NOT NULL, section_id INT(11) NOT NULL, project_id INT(11) NOT NULL, status_id INT(11), task VARCHAR(255), description VARCHAR(255), start_date DATE, due_date DATE )";
  /*CREATE TABLE `project_management_system`.`task_user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`id`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;
  */
  var sqlTaskUser = "CREATE TABLE task_user (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id INT(11) NOT NULL, task_id INT(11) NOT NULL)";
  /*  CREATE TABLE `project_management_system`.`task_status` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `status` VARCHAR(255) NOT NULL,
      PRIMARY KEY (`id`));
    */

  var sqlTaskStatus = "CREATE TABLE task_status (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY , status VARCHAR(255) NOT NULL);";
  /*  CREATE TABLE `project_management_system`.`comments` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,`task_id` INT NOT NULL,

   `project_id` INT NOT NULL,
   `comment` VARCHAR(500) NULL,
    PRIMARY KEY (`id`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;
  */
  var sqlComment = "CREATE TABLE comment (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY ,user_id INT(11) NOT NULL, task_id INT(11) NOT NULL, project_id INT(11) NOT NULL, comment VARCHAR(500) NOT NULL);";
  var sqlProjectUser = "CREATE TABLE `project_management_system`.`project_user` (" +
    "  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY," +
    "  `project_id` INT NOT NULL," +
    "  `user_id` INT NOT NULL)";
  // "  PRIMARY KEY (`id`));";


  var alterTableProject = "ALTER TABLE `project_management_system`.`project` DROP COLUMN `user_id`;"
  var alterTableSection = "ALTER TABLE `project_management_system`.`section` ADD COLUMN `project_id` INT(11);"
  var alterTableSectionRename = "ALTER TABLE `project_management_system`.`section` RENAME COLUMN `title` TO`section`;"

  // con.query(alterTableProject, function (err, result) {
  //     if (err) throw err;
  //     console.log("Alter table project created");
  //   });

  // con.query(alterTableSection, function (err, result) {
  //   if (err) throw err;
  //   console.log("Aletr Table Section created");
  // });

  con.query(alterTableSectionRename, function (err, result) {
    if (err) throw err;
    console.log("Table renamed");
  });


  // con.query(sqlProjectUser, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table Project_User created");
  // });

  // con.query(sqlUser, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table User created");
  // });

  // con.query(sqlProject, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table Project created");
  // });
  // con.query(sqlSection, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table Section created");
  // });
  // con.query(sqlTask, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table Task created");
  // });
  // con.query(sqlTaskUser, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table TaskUser created");
  // });
  // con.query(sqlTaskStatus, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table TaskStatus created");
  // });
  // con.query(sqlComment, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table Comment created");
  // });
});
