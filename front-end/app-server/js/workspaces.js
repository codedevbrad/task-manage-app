console.log('workspaces working');


/* --- create a workspace -- */

var addnewworkspace =  document.getElementsByClassName('workspace-btn')[0];

if (addnewworkspace) {
  addnewworkspace.addEventListener('click', toggleNew);
};

function toggleNew () {
  var totoggle = document.getElementsByClassName('workspace-new')[0];
  totoggle.classList.toggle('workspace-state');
}

var submitWorkspace = document.getElementById('workspace-enter');

if (submitWorkspace) {
  submitWorkspace.addEventListener('click', submitreq);
}

function dataID() {
  var ID = '';
  var letter = ("abcdefghijklmnopqrstuvwxyz").split("");

  for (var i = 0; i < 24; i ++) {
    if (Math.round((Math.random() * 1)) == 0) {
      ID += Math.floor((Math.random() * 9) + 1);
    }
    else {
      var length = letter.length;
      ID += letter[Math.floor(Math.random()* length)];
    }
  }
  return ID
}

function submitreq() {
  var name = document.getElementById('workspace-name').value;
  var desc = document.getElementById('workspace-description').value;
  var ID   = dataID();
  
  axios.post('/0/auth/workspace-new', {
    name: name,
    description: desc,
    data_id: ID
  })
  .then(function (res) {

    // fake workspace
    var main = document.getElementById('workspaces-center');
    var workspace = document.createElement('section');  workspace.classList.add('flex-each-workspace');

    // remove no workpace && new workspace toggle .
    workspace.innerHTML += '<div class=workspace-flex-main>' +
                           '<h1>' + name + '</h1>' +
                           '<p>'  + desc + '</p> ' +
                           '</div>' +
                           '<div class=workspace-flex-following>' +
                           '<a class=workspace-btn join-workspace href=/0/workspace/' + ID + '>' + 'join workspace' + '</span>';
    // do logic
    var none = document.getElementById('no-workspace');
    if (none) { main.removeChild(none); }

    var totoggle = document.getElementsByClassName('workspace-new')[0];
    totoggle.classList.remove('workspace-state');

    // append new workspace
    main.appendChild(workspace);

    // add click to workspace btn ...
    var joinbutton = document.getElementById('workspace-btnLogictoAdd');
    joinbutton.addEventListener('click', joinWorkspace);

  })
  .catch(function (error) {  });
}
