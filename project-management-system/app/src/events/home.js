var isLoggedIn = localStorage.getItem('token');


window.addEventListener('load', function (e) {
    //  e.preventDefault();

    var task;
    var projDashboard;
    var chart;
    if (!isLoggedIn) {
        task = document.getElementById('tasksLink').style.display = 'none';
        projDashboard = document.getElementById('projectDashboardLink').style.display = 'none';
        chart = document.getElementById('chartLink').style.display = 'none';
    } else {
        task = document.getElementById('tasksLink').style.display = '';
        projDashboard = document.getElementById('projectDashboardLink').style.display = '';
        chart = document.getElementById('chartLink').style.display = '';
    }
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('projectDashboard').style.display = 'none';
    document.getElementById('alertRegister').style.display = 'none';
    document.getElementById('alertLogin').style.display = 'none';

    document.getElementById('sectionDefaultPrim').style.display = 'none';
    document.getElementById('project_title_head').style.display = 'none';

});
