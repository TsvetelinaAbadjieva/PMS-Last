var mysql = require('mysql');
var con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
  //  password: "root",
    database: "project_management_system"
});
var passwordHash = require('password-hash');
var hashedPassword = passwordHash.generate('password123');
con.connect(function (err) {
    if (err) throw err;
});

//  SELECT task.id as id, task.project_id as projectId, task.section_id as sectionId, task.status_id as statusId, task.task as task,
// task.description as description, task.due_date as dueDate, section.section as section, task_status.status as status  FROM project_management_system.task
// JOIN project_management_system.section
// ON section.id = task.section_id
// JOIN project_management_system.task_status
// ON task_status.id = task.status_id
// JOIN
// project_management_system.project
// ON project.id = task.project_id
// WHERE task.project_id=2;

exports.insertTask = function (task, func) {

    // var user = JSON.parse(user);

    var tu = [];
    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "INSERT INTO `task` (user_id, project_id, section_id, status_id, task, description, start_date, due_date) VALUES (?,?,?,?,?,?,?,?)";
    tu.push(task.userId);
    tu.push(task.projectId);
    tu.push(task.sectionId);
    tu.push(task.statusId);
    tu.push(task.task);
    tu.push(task.description);
    tu.push(task.startDate);
    tu.push(task.dueDate);
    var values = [tu];


    con.query(sql, [parseInt(task.userId), parseInt(task.projectId), parseInt(task.sectionId), parseInt(task.statusId), task.task, task.description, task.startDate, task.dueDate], function (err) {
        if (err) throw err;
            var sqlId = "SELECT max(id) AS id FROM task";
            con.query(sqlId, function (error, result) {
              if(error) throw error;
              func(err, result);
            });
    });
};

exports.insertTaskUser = function(userId, taskId) {

  var sql = "INSERT INTO task_user (user_id, task_id) VALUES (?, ?)";
  con.query(sql, [userId, taskId], function (error) {
      if (error) throw error;
  });
};

exports.insertComment = function (comment, func) {

    var tu = [];
    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "INSERT INTO comment (user_id, task_id, project_id, comment) VALUES ?";
    tu.push(comment.user_id);
    tu.push(comment.task_id);
    tu.push(comment.project_id);
    tu.push(comment.comment);

    var values = [tu];

    con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        func(err, result.affectedRows);
    });
};
exports.insertProject = function (project, func) {

    var tu = [];
    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "INSERT INTO project (title, description, pr_start_date, pr_due_date) VALUES ?";
    //tu.push(project.user_id);
    tu.push(project.title);
    tu.push(project.description);
    tu.push(project.startDate);
    tu.push(project.dueDate);

    var values = [tu];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        func(err, result.affectedRows);
    });
};

exports.checkExistingSection = function(section, func) {

  var values = [section.projectId, section.section];
  var sql = "SELECT * FROM section WHERE project_id = ? AND section = ? LIMIT 1";
  con.query(sql, values, function(err, result){
    if(err) throw err;
    func(result);
  });
};

exports.insertSection = function (section, func) {

  exports.checkExistingSection(section, function(data){

    if (data.length == 0) {

      var tu = [];
      var sql = "INSERT INTO `section` (section, project_id) VALUES (?,?);";

      tu.push(section.section);
      tu.push(section.projectId);

      con.query(sql, [section.section, section.projectId], function (err) {
          if (err) throw err;
          var sqlId = "SELECT max(id) AS id FROM section";

          con.query(sqlId, function (err, result) {
              func(err, result);
          });
      });
    }
  });
};

exports.lastInsertedSection = function (section, func) {

    var tu = [];
    //INSERT INTO `user` (`name`) VALUES ('John');
    var sqlId = "SELECT max(id) FROM section";
    //var sql = "INSERT INTO `section` (title, project_id) VALUES ?";
    tu.push(section.section);
    tu.push(section.project_id);
    var values = [tu];
    exports.insertSection(section, function (error, result) {
        if (error) throw error;
        func(err, result);

    });
};

exports.insertTaskStatus = function (taskStatus, func) {

    var tu = [];
    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "INSERT INTO `task_status` (status) VALUES ?";
    tu.push(taskStatus.status);

    var values = [tu];

    con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        func(err, result.affectedRows);
    });
};

// exports.insertTaskUser = function (taskUser, func) {
//
//     var tu = [];
//     //INSERT INTO `user` (`name`) VALUES ('John');
//     var sql = "INSERT INTO `task_user` (task_id, user_id) VALUES ?";
//     tu.push(taskUser.task_id);
//     tu.push(taskUser.user_id);
//
//     var values = [tu];
//
//     con.query(sql, values, function (err, result) {
//         if (err) throw err;
//         console.log("Number of records inserted: " + result.affectedRows);
//         func(err, result.affectedRows);
//     });
// };

exports.insertUser = function (user, func) {

    exports.checkExistingUser(user, function (result) {

        var resultMessage = '';
        if (result.length > 0) {

            var resultMessage = { status: 400, message: 'This user already exists!' };
            func(resultMessage);
            return;

        }
        var users = [];
        //INSERT INTO `user` (`name`) VALUES ('John');
        var sql = "INSERT INTO user (first_name, last_name,username, password, email) VALUES (?,?,?,?,?);";
        users.push(user.firstName);
        users.push(user.lastName);
        users.push(user.username);
        users.push(user.password);
        users.push(user.email);

        var values = [users];

        con.query(sql, [user.firstName, user.lastName, user.username, user.password, user.email], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            resultMessage = { status: 200, message: ' Registration successful! Please login' };
            func(resultMessage);
        });

    });

};
exports.getUserCollection = function (func) {

    var sql = "SELECT * FROM user";
    var user = [];

    con.query(sql, function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            user.push(result[i]);
        }
        console.log(result);
        //func(JSON.stringify(user));
    });
};

//get all sections with their tasks for one project and user
exports.getSectionTaskCollection = function (res, projectId, func) {

    var sql = "SELECT task.id as taskId, task.project_id as projectId, task.section_id as sectionId, task.status_id as statusId, task.task as task, "+
    "task.description as description, task.due_date as dueDate, section.section as section, task_status.status as status  FROM project_management_system.task "+
    "JOIN project_management_system.section "+
    "ON section.id = task.section_id "+
    "JOIN project_management_system.task_status "+
    "ON task_status.id = task.status_id "+
    "JOIN "+
    "project_management_system.project "+
    "ON project.id = task.project_id "+
    "WHERE task.project_id = ?; ";

    var resultCollection = [];
    con.query(sql, [projectId], function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(result);
        func(res, err, resultCollection);
    });
};

//get all sections adjacent to all projects
//SELECT section.title, project.title FROM project_management_system.section, project_management_system.project WHERE section.project_id=project.id;
exports.getSectionCollection = function (res, func) {

    var sql = "SELECT section.title, project.title" +
        "FROM project_management_system.section, project_management_system.project" +
        " WHERE section.project_id = project.id";
    var resultCollection = [];
    console.log(id);
    con.query(sql, function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(result);
        func(res, err, resultCollection);
    });
};

//get all sections for selected project
exports.getSectionCollectionByProject = function (res, projectId, func) {

    var sql = "SELECT section.id, section.section" +
        "FROM project_management_system.section, project_management_system.project" +
        " WHERE section.project_id = project.id AND project.id =?";
    var resultCollection = [];
    console.log(id);
    con.query(sql, [parseInt(projectId)], function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(result);
        func(res, err, resultCollection);
    });
};

//get all projects from the user account
exports.getProjectCollectionByUser = function (res, userId, func) {

    var sql = "SELECT DISTINCT project.id as id, project.title , project.description,  project.pr_start_date, project.pr_due_date  " +
        " FROM project_management_system.project_user, project_management_system.project  " +
        " WHERE  (project_user.project_id = project.id  " +
        " AND project_user.user_id = ? )";
    var resultCollection = [];
    con.query(sql, [parseInt(userId)], function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(resultCollection);
        func(res, err, resultCollection);
    });
};

exports.getProjectCollection = function (res, func) {

    var sql = "SELECT * " +
        " FROM project_management_system.project";
    var resultCollection = [];
    con.query(sql, function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(result);
        func(res, err, resultCollection);
    });
};

//get users for project to fill selectlist
exports.getUserByProjectCollection = function (projectId, func) {

    var sql = "SELECT user_id as userId, project_id as projectId, first_name as firstName, last_name as lastName FROM  project_management_system.user "+
    "JOIN project_management_system.project_user  "+
    "ON user.id = project_user.user_id  "+
    "where project_user.project_id = ?;"
    var user = [];

    con.query(sql, [projectId], function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            user.push(result[i]);
        }
        console.log(err, result);
        func(err, user);
    });
};

exports.assignToProject = function (userProject, func) {

    var sql = "INSERT INTO project_user (project_id, user_id) VALUES (?,?)";

    con.query(sql, [userProject.projectId, userProject.id], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        func(err, result.affectedRows);
    });
};
//select tasks from section
//get tasks from  given section
exports.getTaskCollectionBySection = function (res, sectionId, func) {

    var sql = "SELECT * FROM " +
        "project_management_system.task, " +
        "project_management_system.section " +
        "WHERE " +
        "task.section_id = section.id AND section.id = ?;";
    var resultCollection = [];
    console.log(id);
    con.query(sql, [parseInt(sectionId)], function (err, result) {

        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            resultCollection.push(result[i]);
        }
        console.log(result);
        func(res, err, resultCollection);
    });
};


exports.getUser = function (id, func) {

    var sql = "SELECT * FROM user WHERE id = ? LIMIT 1";
    var user = [];
    user.push(id);
    var values = [user]

    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        console.log(result);
        func(JSON.stringify(result[0]));
    });
};

exports.updateToken = function (username, email, token) {

    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "UPDATE user SET token = ? WHERE (username = ? AND email = ?);";
    con.query(sql, [username, email, token], function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
    });
};

exports.checkToken = function (id, token) {

    //INSERT INTO `user` (`name`) VALUES ('John');
    var sql = "SELECT * FROM user  WHERE (id = ? AND token =?) LIMIT 1;";
    con.query(sql, [id, token], function (err, result) {
        if (err) throw err;
        if (result) return true;
        return false;
        console.log("Number of returned rows: " + result.numRows);
    });
};

exports.checkUserLogin = function (user, func) {
console.log('In login');
console.log(user);
    var users = [];
    var sql = "SELECT * FROM user WHERE username = ?  LIMIT 1";

    var values = [user.email];

    con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log(result)
        func(err, result);
    });
};
exports.checkExistingUser = function (user, func) {

    var users = [];
    var sql = "SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1";
    users.push(user.username);
    users.push(user.email);

    var values = [user.username, user.email];

    con.query(sql, values, function (err, result) {

        if (err) throw err;
        func(result);
        // if (result.length > 0) {
        //     console.log('Exists');
        // } else {
        //     console.log('Not Exists');
        // }
    });
};

exports.getTaskDetails = function(task, func) {

  var values = [task.taskId];
  console.log(task.taskId)
  var sql = "SELECT task.task, task.description, task.status_id, task.due_date, user.first_name, user.last_name, task_status.status from task "+
  " JOIN task_status "+
  " ON task.status_id = task_status.id "+
  " JOIN user "+
  " ON task.user_id = user.id "+
  " WHERE task.id = ? LIMIT 1";
  con.query(sql, values, function (err, result) {

      if (err) throw err;
      func(err, result);
  });
};

//DONT TOUCH THIS CODE - stupid, but working :)!!
exports.insertResult = function (res, user_id, result, func) {

    var sql = "INSERT INTO result (result, user_id, date) values (?,?, NOW())";
    //  var values = [[result, parseInt(id)]];

    con.query(sql, [parseInt(result), parseInt(user_id)], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted into Group: " + result.affectedRows);
        func(res, err, result);
    });
};

//test examples
//test data for insert user
/*
var user = {
    firstName: 'Dima',
    lastName: 'Angelova',
    username: 'd_angelova',
    email: 'd_angelova@gmail.com',
    password: '123456'
}

exports.insertUser(user, null);
exports.getUserCollection(null);
*/
var password = passwordHash.generate('stoyan123I');
var project = {
    user_id: 51,
    title: 'Design',
    description: 'Create Design patterns for project architecture',
    pr_start_date: '2017-01-1',
    pr_due_date: '2017-12-31'
};

//exports.getProjectCollectionByUser(null, 15, null);
