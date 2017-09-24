document.getElementById('logoutLink').addEventListener('click', function(){
  if(isLoggedIn) {
    var user = localStorage.getItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.getElementById('loginLink').click();
    document.getElementById('userLoggedIn').innerText = user+', You logged out the system';
    document.getElementById('userLoggedIn').style.display = 'block';
  }
});
