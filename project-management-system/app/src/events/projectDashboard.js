var flagValidation = true;
var taskSectionId = 0;
var taskProjectId = 0;
var newTaskBtn = null;
var projectDashboardLinkClicked = false;
var newTaskOpenBtn = '';
var defaultSection = false;

document.getElementById('projectDashboardLink').addEventListener('click', function () {

  //  var oldProjects = [];
  document.getElementById('projectDashboard').style.display = '';
  document.getElementById('newCardProject').style.display = 'none';
  projectDashboardLinkClicked = true;
  removeSectionCollection();
  removeUnusableLi();

  var data = {};
  if (isLoggedIn) {
    var userEmail = localStorage.getItem('user');
    var info = document.getElementById('userLoggedIn');
    info.innerText = userEmail + ", Welcome to Your dashboard!";
    info.style.fontSize = "larger";
    info.style.display = 'block';

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', BASE_URL + '/projects', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 & xhttp.status == 200) {
        console.log(xhttp.responseText);
        data = JSON.parse(xhttp.responseText);
        drawProjectBoardCollection(data.data);
      }
    }
    xhttp.send();

  }
  else {
    info.style.display = 'none';
  }
});

document.getElementById('myProjectsLink').addEventListener('click', function () {

  document.getElementById('projectDashboard').style.display = '';
  document.getElementById('newCardProject').style.display = 'none';
  document.getElementsByClassName('projectBoard')[0].id = 'project_board';
  projectDashboardLinkClicked = false;

  removeUnusableLi();
  removeSectionCollection();

  var headerConfig = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem('token')
  }
  var data = {};
  if (isLoggedIn) {
    var userEmail = localStorage.getItem('user');
    var info = document.getElementById('userLoggedIn');
    info.innerText = userEmail + ", Welcome to Your dashboard!";
    info.style.fontSize = "larger";
    info.style.display = 'block';

    // callAjax('GET', BASE_URL + '/user/projects', headerConfig, null, function(data){
    //   drawProjectBoardCollection(data.data);
    // });
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', BASE_URL + '/user/projects', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 & xhttp.status == 200) {
        console.log(xhttp.responseText);
        data = JSON.parse(xhttp.responseText);
        drawProjectBoardCollection(data.data);
      }
    }
    xhttp.send();
  }
  else {
    info.style.display = 'none';
  }
});

document.getElementById('newProject').addEventListener('click', function () {
  document.getElementById('newCardProject').style.display = '';
  document.getElementById('alertInsertProject').style.display = 'none';
});

document.getElementById('projectTitleInput').addEventListener('change', fieldValidate);
document.getElementById('projectDescriptionInput').addEventListener('change', fieldValidate);
document.getElementById('projectDateInput').addEventListener('change', fieldValidate);

function fieldValidate() {

  console.log(this.id);
  console.log('Index of task');
  console.log(this.id.indexOf('task'));
  var input = this.value;
  var alert;
  if (this.id.indexOf('project') !== -1) {
    alert = document.getElementById('alertInsertProject');
  }
  if (this.id.indexOf('task') !== -1) {
    alert = document.getElementById('alertInsertTask');
  }

  console.log(alert);

  var correctDate = validateDueDate(input);

  if ((this.id == 'projectDateInput' || this.id == 'taskDueDateInput') && (!input || correctDate == false)) {

    alertMessage(alert, 'Please enter a valid date');
    flagValidation = false;
    return;
  } else {
    flagValidation = true;
  }

  if (validateInputField(input)) {

    alert.style.display = 'none';
    flagValidation = true;
  }
  else {

    alertMessage(alert, 'Please enter a valid information');
    flagValidation = false;
  }
  console.log(flagValidation);

};

drawProjectBoardCollection = function (data) {

  var oneBoard = document.getElementById('project');
  var container = document.getElementById('projectCollection');
  var fragment = document.createDocumentFragment();
  var projectTitle = document.getElementById('projectTitle');
  var projectDescription = document.getElementById('projectDescription');

  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i])
      var cloned = document.createElement('li');
      cloned = document.getElementById('project').cloneNode(true);
      cloned.querySelector('h4').innerText = data[i].title;
      cloned.querySelector('h4').style.color = 'grey';
      cloned.querySelector('#assignMe').setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#goToProject').setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#goToProject').addEventListener('click', redirectToProject);
      cloned.querySelector('#assignMe').addEventListener('click', assignMe);
      cloned.querySelector('p').innerText = data[i].description;
      cloned.setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#startDate').innerText = data[i].pr_start_date.split('T')[0];
      cloned.querySelector('#endDate').innerText = data[i].pr_due_date.split('T')[0];
      cloned.querySelector('#alertAssign').id = 'alertAssign_' + data[i].id;
      cloned.querySelector('#alertAssign').style.display = 'none';
      cloned.style.display = 'block';
      cloned.id = "project_" + data[i].id;
      console.log(cloned);
      if (projectDashboardLinkClicked) {
        cloned.querySelector('#goToProject').style.display = 'none';
      }
      fragment.appendChild(cloned);

    }
    container.appendChild(fragment);
  }
  projectDashboardLinkClicked = false;
};

document.getElementById('saveProject').addEventListener('click', function () {

  var projectTitle = document.getElementById('projectTitleInput').value;
  var projectDescription = document.getElementById('projectDescriptionInput').value;
  var dueDate = document.getElementById('projectDateInput').value;
  var alert = document.getElementById('alertInsertProject');

  if (flagValidation) {

    projectTitle = escapeString(projectTitle);
    projectDescription = escapeString(projectDescription);

    var reqObj = {
      title: projectTitle,
      description: projectDescription,
      startDate: getToday(),
      dueDate: dueDate
    };
    console.log(reqObj);
    url = BASE_URL + '/project';
    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    };

    callAjax('POST', url, headerConfig, reqObj, function (data) {
      var alert = document.getElementById('alertInsertProject');
      alert.classList.remove('alert-danger');
      alert.classList.add('alert-success');
      alertMessage(alert, data.message);
    });
  }
  else {
    alertMessage(alert, 'Please, enter a valid input data');
  }
});

document.getElementById('closeProject').addEventListener('click', function () {
  document.getElementById('newCardProject').style.display = 'none';
});

function assignMe() {

  //e.preventDefault();
  var _this = document.activeElement;
  console.log(_this);

  var projectLi = document.getElementById('project_' + _this.getAttribute('data_project_id'));
  var projectId = _this.getAttribute('data_project_id');
  var alert = document.getElementById('alertAssign_' + _this.getAttribute('data_project_id'));
  console.log(alert);
  var params = JSON.stringify({ projectId: projectId });
  var reqObj = { projectId: projectId };
  var data = {};
  if (isLoggedIn) {
    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    }
    callAjax('POST', BASE_URL + '/project/assign', headerConfig, reqObj, function (data) {
      alertMessage(alert, data.message);
    })
  }
};

function newSectionClick() {
  document.getElementById('sectionDefault').querySelector('#addSection').style.display = 'block';
  document.getElementById('sectionDefault').querySelector('#newSectionTitle').style.display = 'block';
  this.style.display = 'none';
};

document.getElementById('addSectionPrim').addEventListener('click', addNewSection);
document.getElementById('newSectionPrim').addEventListener('click', newSectionClick);
document.getElementById('newTaskOpenPrim').addEventListener('click', saveProjectSectionId);
document.getElementById('viewTaskOpenPrim').addEventListener('click', loadTaskDetails);

function addNewSection() {

  document.getElementById('newSection').style.display = 'block';
  document.getElementById('newSectionTitle').style.display = 'none';
  this.style.display = 'none';
  var input = document.getElementById('newSectionTitle').value;
  var alert = document.getElementById('alertCreateSection');
  var sectionId = 0;

  if (validateInputField(input)) {

    input = escapeString(input);

    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    };
    var url = BASE_URL + '/section';

    var reqObj = {
      section: input,
      projectId: this.getAttribute('data_project_id')
    };
    var _document = document;
    var _this = this;

    callAjax('POST', url, headerConfig, reqObj, function (data) {

      // data.data is the section id retireved form DB after insert
      alert.classList.remove('alert-danger');
      alert.classList.add('alert-success');
      var newSection = _document.createElement('div');
      newSection = _document.getElementById('sectionDefaultPrim').cloneNode(true);
      newSection.querySelector('#cardDefaultPrim').style.display = 'none';
      renameDefaultPrimarySection(newSection);

      //sectionDefaultPrimRename();
      _document.getElementById('project_board_' + _this.getAttribute('data_project_id')).appendChild(newSection);

      newSection.setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.id = 'section_id_' + data.data;
      newSection.setAttribute('data_section_id', data.data);

      newSection.querySelector('#section_head').setAttribute('data_section_id', data.data);
      newSection.querySelector('#section_head').id = 'section_head_' + data.data;
      newSection.querySelector('#section_head_' + data.data).innerText = input;

      newSection.querySelector('#newTaskOpen').setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.querySelector('#newTaskOpen').setAttribute('data_section_id', data.data);
      newSection.querySelector('#newTaskOpen').id = 'newTaskOpen_' + data.data;
      newSection.querySelector('#newTaskOpen_' + data.data).addEventListener('click', saveProjectSectionId);

      newSection.querySelector('#newSection').style.display = 'none';
      newSection.querySelector('#newSection').id = 'newSection_' + data.data;
      newSection.querySelector('#newSection_' + data.data).addEventListener('click', addNewSection);

      newSection.querySelector('#viewTaskOpen').setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.querySelector('#viewTaskOpen').setAttribute('data_section_id', data.data);

      alertMessage(alert, 'Created section ' + input);
    });
  }
  else {
    alertMessage(alert, 'Please, fill the box ');
  }
}

function removeUnusableLi() {

  var oldProjects = document.getElementsByClassName('project');
  for (var k = 1; k < oldProjects.length; k++) {

    var item = oldProjects[k];
    item.style.display = 'none';
  }
};

function drawSectionBody(sectionId, projectId, title, _document) {

  //_this is the pattern template
  //clonePrimarySection(projectId, _document);
  var newSection = _document.createElement('div');
  newSection = _document.getElementById('sectionDefaultPrim').cloneNode(true);
  newSection.querySelector('#cardDefaultPrim').style.display = 'none';
  renameDefaultPrimarySection(newSection);

  _document.getElementById('project_board_' + projectId).appendChild(newSection);

  newSection.setAttribute('data_project_id', projectId);
  newSection.id = 'section_id_' + sectionId;
  newSection.setAttribute('data_section_id', sectionId);

  newSection.querySelector('#section_head').setAttribute('data_section_id', sectionId);
  newSection.querySelector('#section_head').id = 'section_head_' + sectionId;
  newSection.querySelector('#section_head_' + sectionId).innerText = title;

  newSection.querySelector('#newTaskOpen').setAttribute('data_project_id', projectId);
  newSection.querySelector('#newTaskOpen').setAttribute('data_section_id', sectionId);
  newSection.querySelector('#newTaskOpen').id = 'newTaskOpen_' + sectionId;
  newSection.querySelector('#newTaskOpen_' + sectionId).addEventListener('click', saveProjectSectionId);

  newSection.querySelector('#newSection').style.display = 'none';
  newSection.querySelector('#newSection').id = 'newSection_' + sectionId;
  newSection.querySelector('#newSection_' + sectionId).addEventListener('click', addNewSection);


  newSection.querySelector('#viewTaskOpen').setAttribute('data_project_id', projectId);
  newSection.querySelector('#viewTaskOpen').setAttribute('data_section_id', sectionId);
};

function drawTaskBody(taskId, sectionId, projectId, section, taskTitle, taskStatus, statusId, taskDescription, _document) {

  var taskTemplate = null;
  var flag = 0;

   if(sectionId == 0){
      taskTemplate = _document.querySelector('#sectionDefault').querySelector('#cardDefault');
      flag = 0;
   }
   else {
    taskTemplate = _document.querySelector('#section_id_'+ sectionId).querySelector('#cardDefault');
    flag =1;
   }
  console.log(taskTemplate)

  var newTask = _document.createElement('li');
  newTask = taskTemplate.cloneNode(true);
  if (flag == 0) {
    newTask.setAttribute('data_section_id', 0);
    newTask.style.display = 'block';
  }
  else{
    newTask.setAttribute('data_section_id', sectionId);
  }
  console.log(newTask);
  //newTask.style.display = 'block';
  newTask.id = 'taskTitle_' + taskId;
  newTask.setAttribute('data_task_id', taskId);

  newTask.querySelector('#taskTitle').id = 'taskTitle_' + taskId;
  newTask.querySelector('#taskTitle_' + taskId).setAttribute('data_task_id', taskId);
  newTask.querySelector('#taskTitle_' + taskId).innerText = taskTitle;
  newTask.querySelector('#taskTitle_' + taskId).style.display = 'block';

  newTask.querySelector('#taskDescription').id = 'taskDescription_' + taskId;
  newTask.querySelector('#taskDescription_' + taskId).setAttribute('data_task_id', taskId);
  newTask.querySelector('#taskDescription_' + taskId).innerHTML = taskDescription;
  newTask.querySelector('#taskDescription_' + taskId).style.display = 'block';

  newTask.querySelector('#btnStatus').id = 'btnStatus_' + taskId;
  newTask.querySelector('#btnStatus_' + taskId).setAttribute('data_task_id', taskId);
  newTask.querySelector('#btnStatus_' + taskId).innerHTML = taskStatus;
  newTask.querySelector('#btnStatus_' + taskId).style.backgroundColor = setTaskStatus(statusId.toString());

  newTask.querySelector('#viewTaskOpen').id = 'viewTaskOpen_' + taskId;
  newTask.querySelector('#viewTaskOpen_'+taskId).setAttribute('data_task_id', taskId);
  newTask.querySelector('#viewTaskOpen_' + taskId).addEventListener('click', loadTaskDetails);

  newTask.id = 'cardDefault_' + taskId;
  newTask.setAttribute('data_task_id', taskId);
  newTask.style.display = 'block';

  var sibling = null;
  if (sectionId != 0) {
    sibling = _document.getElementById('section_id_' + sectionId).querySelector('#cardDefault');
  }
  else {
    sibling = _document.getElementById('sectionDefault').querySelector('#cardDefault');
  }
  var parent = sibling.parenNode;

  sibling.parentNode.insertBefore(newTask, sibling.nextSibling.nextSibling.nextSibling);

};

function redirectToProject() {

  document.getElementById('sectionDefaultPrim').style.display = 'none';
  removeSectionCollection();
  document.getElementById('project_title_head').style.display = 'block';

  var projectId = this.getAttribute('data_project_id');
  console.log(projectId);
  var info = document.getElementById('userLoggedIn').innerText;
  var projectTitle = document.getElementById('project_' + projectId).querySelector('h4').innerText;
  document.querySelector('#project_title_head').innerText = localStorage.getItem('user') + ", Welcome to " + projectTitle;
  console.log(document.getElementById('project_board'));
  document.getElementById('project_board').setAttribute('data_project_id', projectId);
  document.getElementById('project_board').id = 'project_board_' + projectId;
  document.getElementById('addSectionPrim').setAttribute('data_project_id', projectId);
  document.getElementById('projectDashboard').style.display = 'none';
  document.getElementById('imgHomePage').style.display = 'none';
  document.getElementById('addSectionPrim').style.display = 'none';
  document.getElementById('newSectionTitlePrim').style.display = 'none';
  document.getElementById('alertCreateSectionPrim').style.display = 'none';

  // TO DO call ajax for retrieve all sections and tasks
  var headerConfig = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem('token')
  };
  var url = BASE_URL + '/sections';

  var reqObj = {
    projectId: projectId,
  };
  var _document = document;
  var _this = this;

  callAjax('POST', url, headerConfig, reqObj, function (data) {

    if(data.data.length == 0 ){
      clonePrimarySection(projectId, _document);
      addDefaultSectionToDB(_this,_document);
      _document.getElementById('sectionDefault').querySelector('#newTaskOpen').style.display = 'none';
      _document.getElementById('sectionDefault').style.backgroundColor = '#868282';
    }
    else {
      if(_document.getElementById('sectionDefault') == undefined ){
        clonePrimarySection(projectId, _document, sectionId);
        addDefaultSectionToDB(_this, _document);

      }
      _document.getElementById('sectionDefault').querySelector('#newTaskOpen').style.display = 'none';
      _document.getElementById('sectionDefault').style.backgroundColor = '#868282';

      for (var i = 0; i < data.data.length; i++) {

        var item = data.data[i];
        var sectionId = item.sectionId;
        var len = data.data.length - 1;
        //while(item.sectionId == )
        if (i > 0 && item.sectionId == data.data[i - 1].sectionId) {
            drawTaskBody(item.taskId, item.sectionId, projectId, item.section, item.task, item.status, item.statusId, item.description, _document);
        }
        else {
          drawSectionBody(item.sectionId, projectId, item.section, _document);
          drawTaskBody(item.taskId, item.sectionId, projectId, item.section, item.task, item.status, item.statusId, item.description, _document);
        }
      }//end for
    }//else
  });
};

function clonePrimarySection(projectId, _document, sectionId) {

  //new
    if(!sectionId) {
      sectionId = 0;
    }
    var defaultClone = _document.createElement('div');
    defaultClone = _document.getElementById('sectionDefaultPrim').cloneNode(true);
    _document.getElementById('project_board_'+projectId).appendChild(defaultClone);

    defaultClone.style.display = 'block';
    defaultClone.id = 'sectionDefault';
    //rename ids in the section cloned
    defaultClone.querySelector('#tasksPrim').id = 'tasks';
    defaultClone.querySelector('#section_headPrim').id = 'section_head';
    defaultClone.querySelector('#cardDefaultPrim').id = 'cardDefault';
    defaultClone.querySelector('#taskTitlePrim').id = 'taskTitle';
    defaultClone.querySelector('#btnStatusPrim').id = 'btnStatus';
    defaultClone.querySelector('#taskDescriptionPrim').id = 'taskDescription';
    defaultClone.querySelector('#viewTaskOpenPrim').id = 'viewTaskOpen';
    defaultClone.querySelector('#newTaskOpenPrim').id = 'newTaskOpen';
    defaultClone.querySelector('#newSectionPrim').id = 'newSection';
    defaultClone.querySelector('#newSectionTitlePrim').id = 'newSectionTitle';
    defaultClone.querySelector('#addSectionPrim').id = 'addSection';
    defaultClone.querySelector('#alertCreateSectionPrim').id = 'alertCreateSection';
//end rename

    defaultClone.querySelector('#cardDefault').style.display = 'none';
    defaultClone.querySelector('#cardDefault').setAttribute('data_project_id', projectId);
    defaultClone.querySelector('#cardDefault').setAttribute('data_section_id', sectionId);
    defaultClone.setAttribute('data_project_id', projectId);
  //  defaultClone.querySelector('#newSection').id = 'newSection_0';
    defaultClone.querySelector('#newSection').setAttribute('data_section_id',sectionId);
    defaultClone.querySelector('#newSection').setAttribute('data_project_id', projectId);
  //  defaultClone.querySelector('#newTaskOpen').id = 'newTaskOpen_0';
    //defaultClone.querySelector('newTaskOpen').addEventListener('click');
  //new end

//add eventListeners
  defaultClone.querySelector('#newSection').addEventListener('click', newSectionClick);
  defaultClone.querySelector('#addSection').addEventListener('click', addNewSection);
  defaultClone.querySelector('#newTaskOpen').addEventListener('click', saveProjectSectionId);
  defaultClone.querySelector('#viewTaskOpen').addEventListener('click', loadTaskDetails);
  //end listeners
  _document.getElementById('sectionDefault').querySelector('#cardDefault').style.display = 'none';
};

function renameDefaultPrimarySection(defaultClone) {

  defaultClone.style.display = 'block';
  defaultClone.id = 'sectionDefault';
  //rename ids in the section cloned
  defaultClone.querySelector('#tasksPrim').id = 'tasks';
  defaultClone.querySelector('#section_headPrim').id = 'section_head';
  defaultClone.querySelector('#cardDefaultPrim').id = 'cardDefault';
  defaultClone.querySelector('#taskTitlePrim').id = 'taskTitle';
  defaultClone.querySelector('#btnStatusPrim').id = 'btnStatus';
  defaultClone.querySelector('#taskDescriptionPrim').id = 'taskDescription';
  defaultClone.querySelector('#viewTaskOpenPrim').id = 'viewTaskOpen';
  defaultClone.querySelector('#newTaskOpenPrim').id = 'newTaskOpen';
  defaultClone.querySelector('#newSectionPrim').id = 'newSection';
  defaultClone.querySelector('#newSectionTitlePrim').id = 'newSectionTitle';
  defaultClone.querySelector('#addSectionPrim').id = 'addSection';
  defaultClone.querySelector('#alertCreateSectionPrim').id = 'alertCreateSection';
};

function saveProjectSectionId() {

  taskSectionId = this.getAttribute('data_section_id') || 0;
  taskProjectId = this.getAttribute('data_project_id') || document.getElementById('sectionDefault').getAttribute('data_project_id');
  newTaskBtn = this;
  newTaskOpenBtn = this.id;
};


function addResponsible() {

  var selectChangeResponsible = document.getElementById('responsibleUserChange');
  var projectId = this.getAttribute('data_project_id');
  var span = document.getElementById('respInsert');
  span.innerHTML =   '<select class="form-group" name="responsible" id="responsibleUserChange">'
  console.log(span)

  var headerConfig = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem('token')
  };
  var url = BASE_URL + '/project/users';

  var reqObj = {
    projectId: projectId
  };

  callAjax('POST', url, headerConfig, reqObj, function (data) {

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.data.lentgh; i++) {
      // var text = data.data[i].firstName + ' ' + data.data[i].lastName;
      // var value = data.data[i].user_id;
      // selectResponsible.options[selectResponsible.options.length] = new Option(text, value);

      var option = _document.createElement('option');
      option.value = data.data[i].user_id;
      option.innerHTML = data.data[i].firstName + ' ' + data.data[i].lastName;
      fragment.append(option);

    //   span += '<option value="'+ data.data[i].user_id+'">'+data.data[i].firstName + ' ' + data.data[i].lastName+'</option>';
    //   console.log(span);
    // //  console.log(option);
    //   console.log(data.data[i].firstName);
    }
  //  span +=  '</select>';
    selectChangeResponsible.appendChild(fragment);
  });
};

function loadTaskDetails() {

  var taskId = this.getAttribute('data_task_id');
  var sectionId = this.getAttribute('data_section_id');
  var projectId = this.getAttribute('data_project_id');
  var _document = document;
  var headerConfig = {
    "Content-type": "application/json",
  };
  var url = BASE_URL + '/task/details';

  var reqObj = {
  //  sectionId: sectionId,
  //  projectId: projectId,
    taskId: taskId
  };

  callAjax('POST', url, headerConfig, reqObj, function (data) {
    console.log('In task');

    console.log(data);
    if(data) {
      var data = data.data;
      _document.getElementById('task').innerText = data.task;
      _document.getElementById('description').innerText = data.description;
      _document.getElementById('dueDate').innerText = data.due_date.split('T')[0];
      _document.getElementById('responsible').innerText = data.first_name+" "+data.last_name;
      _document.getElementById('btnTaskStatus').innerText = data.status;
      _document.getElementById('btnTaskStatus').style.backgroundColor = setTaskStatus(data.status_id.toString());
    }
  });

  _document.querySelector('#editTask').id = 'editTask_'+taskId;
  _document.querySelector('#editTask_'+taskId).setAttribute('data_project_id', projectId);
//  _document.querySelector('editTask_'+taskId).addEventListener('click', addResponsible);
  // TO DO load task data
};

function removeSectionCollection() {

  var node = document.getElementsByClassName('projectBoard')[0];
    while( node.childNodes.length > 2) {
      node.removeChild(node.lastChild);
    }
    document.getElementById('project_title_head').style.display ='none';
};

function addDefaultSectionToDB(_this, _document) {

  var headerConfig = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem('token')
  };
  var url = BASE_URL + '/section';

  var reqObj = {
    section: 'Section Default',
    projectId: _this.getAttribute('data_project_id')
  };

  callAjax('POST', url, headerConfig, reqObj, function (data) {
    clonePrimarySection(reqObj.projectId,_document, data.data);
    drawSectionBody(data.data, reqObj.projectId, reqObj.section, _document);
  });
};
