document.getElementById('loginLink').addEventListener('click', function () {
        document.getElementById('login').style.display = '';
        document.getElementById('register').style.display = 'none';
        
});

document.getElementById('btnLogin').addEventListener('click', function (e) {

        e.preventDefault();
        var email = escapeString(document.getElementById('inputEmail').value);
        var password = escapeString(document.getElementById('inputPassword').value);
        var alert = document.getElementById('alertLogin');
        var errorMessage = '';
        var message = '';

        if (validateEmail(email) && validatePassword(password)) {

                var user = {
                        email: email,
                        password: password
                };
                console.log(BASE_URL);
                var userString = JSON.stringify(user);
                var xhttp = new XMLHttpRequest();
                xhttp.open('POST', BASE_URL + '/login', true);
                xhttp.setRequestHeader("Content-type", "application/json");

                xhttp.onreadystatechange = function () {

                        if (xhttp.readyState == 4 && xhttp.status == 200) {

                                var resp = JSON.parse(xhttp.responseText);
                                if (resp.status == 200) {

                                        localStorage.setItem('token', resp.token);
                                        localStorage.setItem('user', user.email);
                                        console.log(resp.token)
                                        message = user.email + ', You Logged in successfully!';

                                        isLoggedIn = true;
                                        var task = document.getElementById('tasksLink').style.display = '';
                                        var projDashboard = document.getElementById('projectDashboardLink').style.display = '';
                                        var chart = document.getElementById('chartLink').style.display = '';

                                        var userLoggedInInfo = document.getElementById('userLoggedIn');
                                        userLoggedInInfo.innerText = user.email+', Welcome to Your Project Dashboard';
                                        userLoggedInInfo.classList.remove('alert-danger');
                                        userLoggedIn.classList.add('alert-info');
                                        userLoggedInInfo.style.display = 'block';
                                        console.log(resp.token);
                                }
                                else if (resp.status == 400) {
                                        message = resp.message;

                                        var alert = document.getElementById('alertLogin');
                                        alert.classList.remove('alert-success');
                                        alert.classList.add('alert-danger');
                                        alert.innerText = message;
                                        alert.style.display = 'block';
                                }
                                console.log(resp.message);
                        }
                }
                xhttp.send(userString);
        }
        else {
                alert.style.display = 'block';
                alert.innerText = 'Username or password might be incorrect';
        }

        window.location.href = BASE_URL + '/#projectDashboard';
        var form = document.getElementById('loginForm');
        form.style.display = 'none';
        document.getElementById('login').removeChild(form);
});
