
console.log('modules working');

/* dropdowns */

var dropselect = document.getElementsByClassName('dropdown');

if (dropselect) {
  for (var drop = 0; drop < dropselect.length; drop++) {
    dropselect[drop].addEventListener('click', dropme);
  }
}

function dropme (el) {

  var el     = el.target;
  var target = el.getElementsByClassName('menu-target')[0];
  
  target.classList.toggle('dropdown-open');

};


console.log('app-load');
var load = document.getElementById('app-load');
if (load) {

  var phrases = [ 'fetching needed data', 'generating workspace members', 'grabbing your channels', 'grab a coffee and get working'];

  (function () {
    addPhrasesToLoad ( phrases );
  })();

  // fake promise based load ..
  setTimeout(function() {
    load.style.display = 'none';
  }, 3700);
}


function addPhrasesToLoad( phrases ) {
  var loadHTML = document.getElementById('populate-load');

  var svg = ' <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>'

  for (var i = 0; i < phrases.length; i++) {
    var div = document.createElement('div');

    if (i == 0) { div.classList.add('load-in-view'); }
    div.innerHTML = '<div class=load-left>' + svg + '</div>' + '<div class=load-right>' + '<h2>' + phrases[i] + '</h2>' + '</div>';

    loadHTML.appendChild(div);
  };
}

// new design

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


console.log('workspace working ');

function Createnewstack(el) {

    console.log('test');

    var togglenewstack = document.getElementById('workspace-new-stack-popup');
    togglenewstack.classList.toggle('newstack-show');

    // var stacknewbox = document.createElement('div');
    //
    // var value = document.getElementById('newstack-name').value;
    // var desc  = document.getElementById('newstack-desc').value;
    // var spaceID = document.getElementsByTagName('body')[0].getAttribute('body_data_id');
    //
    // axios.post('/0/auth/workspace/stack/new', { stackname: value, spaceID: spaceID })
    // .then(function  (res) { })
    // .catch(function (error) { console.log(error) });
}

var newstack = document.getElementById('create-stack-btn');

if (newstack) { newstack.addEventListener('click', Createnewstack); }
