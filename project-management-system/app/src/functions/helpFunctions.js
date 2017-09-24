validateInputField = function (input) {

  if (input == '') return false;
  return true;
}

validateUsername = function (username) {

    var message = '';
    if (username == '') {
        return false;
    }
    if (username.length < 3) {
        return false;
    }

    username = username.trim();
    var patt = /^[a-zA-Z\-]+$/;
    var res = patt.test(username);

    if (!res) {
        return false;

    } else {
        return true;
    }
    return true;
};

    validateEmail = function (email) {

        var patt = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email == '') return false;
        email = email.trim();
        var res = patt.test(email);
        if (!res) {
            return false;
        } else {
            return true;
        }
    };

    validatePassword = function (password) {

        if (password.length < 6) {
            return false;
        }
        password = password.trim();
        var patt = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        var res = patt.test(password);

        if (!res) {
            return false;

        } else {
            return true;
        }

    };

    validateDueDate = function(input) {

      var today = getToday();
      var correctDate = (today.toString() < input.toString());
      return correctDate;
    };

    getToday = function() {

      var date = new Date();
      var day = (parseInt(date.getDate())>9) ? date.getDate() : '0'+date.getDate();
      var month = (parseInt(date.getMonth())>8) ? (parseInt(date.getMonth())+1) : '0'+(parseInt(date.getMonth())+1);
      var today = date.getFullYear() +'-'+ month +'-'+day;
      return today;
    };

    escapeString = function (str) {

        var safeStr = '';
        if (str !=''){
          safeStr = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace('  ',' ').trim();
        }
        return safeStr;
    };

    alertMessage = function(alertEl, message) {
      alertEl.innerText = message;
      alertEl.style.display = 'block';
      setTimeout(function(){
        alertEl.style.display = 'none';
      }, 3000);
    };

    callAjax = function(method, url, headerConfig, reqObj, func ) {

      var params;
      if(reqObj != null) {
        params = JSON.stringify(reqObj)||'';
      }
      var params = JSON.stringify(reqObj)||'';
      var xhttp = new XMLHttpRequest();
      xhttp.open(method, url, true);
      for (var prop in headerConfig) {
          xhttp.setRequestHeader( prop, headerConfig[prop]);
      }
      xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 & xhttp.status == 200) {
              console.log(xhttp.responseText);
              data = JSON.parse(xhttp.responseText);
              func(data);
          }
      }
      if(reqObj === null) {
        xhttp.send();
      } else {
        xhttp.send(params);
      }
    };

    setTaskStatus = function(statusId) {

        var color ='';
        switch(statusId) {
            case "1":
                color = "#6fccb6";//to do
                break;
            case "2":
                color = "#e2f384";//in process
                break;
            case "3":
                color = "#f3c184";// await
                break;
            case "4":
                color = "#3ba243"; //done
                break;
            case "5":
                color = "#d66ce2";//pending
                break;
            default:
                color = "grey";
        }
        return color;
    };
