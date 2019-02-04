
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


/* -- open / close content -- */

function CreatenewContent(el) {

    console.log(el.target);

    var idFind = el.target.getAttribute("data-content-new");
    var target = document.getElementById(idFind);

    target.classList.add('newcontent-show');

    var close = target.getElementsByClassName('new-contentclose-btn')[0];

    close.addEventListener('click', function() {
      var remove = document.getElementById(idFind);
      remove.classList.remove('newcontent-show');
    });
}


console.log('app-load');
var load = document.getElementById('app-load');
if (load) {

  var phrases = [ 'fetching needed data', 'generating workspace members', 'grabbing your channels', 'grab a coffee and get working'];

  // var phrases = [
  //                { phrase: 'fetching needed data' },
  //                { phrase: 'generating workspace members',  url: '/0/workspace/get/data/' },
  //                { phrase: 'grabbing your channels',        url: '/0/workspace/get/data/' },
  //                { phrase: 'grab a coffee and get working', url: '/0/workspace/get/data/' }
  //               ]

  (function () {
    addPhrasesToLoad ( phrases, function() {

        firstMethod().then(secondMethod).then(thirdMethod).then(finished);
    });
  })();
}

function addPhrasesToLoad( phrases, gettingdata ) {

  var loadHTML = document.getElementById('populate-load');

  for (var i = 0; i < phrases.length; i++) {
    var div = document.createElement('div');

    if (i == 0) { div.classList.add('load-in-view'); }
    div.innerHTML = '<div class=load-left>' + '</div>' + '<div class=load-right>' + '<h2>' + phrases[i] + '</h2>' + '</div>';

    loadHTML.appendChild(div);
  };
  gettingdata();
}

function getData( url ) {

  return axios.get( url ).then(function (response) {
      return response;
  });
}

function animation (currEl) {
     var element = document.getElementById('populate-load');
     var current = element.childNodes[currEl];

     var tick = current.getElementsByClassName('load-left')[0];

     tick.innerHTML = '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';

     current.classList.add('load-in-view');
}

function displayData( response ) {
  console.log(response.data);
}

var delay = 200;

// get needed left side content

function firstMethod () {
   var promise = new Promise(function(resolve, reject) {

      var stage = 0;
      // ajax request
      getData('/0/workspace/get/data/1').then(function (response) {

          displayData(response);

          setTimeout(function() {
            resolve(); animation(stage);
          }, delay);

      }).catch(function (error) {
          reject('error: somethings wrong');
      });
   });
   return promise;
};

// get workspace content

function secondMethod (someStuff) {
   var promise = new Promise(function(resolve, reject){

     var stage = 1;
     // ajax request
     getData('/0/workspace/get/data/2').then(function (response) {

       displayData(response);

       setTimeout(function() {
         resolve(); animation(stage);
       }, delay);

     }).catch(function (error) {
         reject('error: somethings wrong');
     });
   });
   return promise;
};

// grabbing your channels

function thirdMethod (someStuff) {
   var promise = new Promise(function(resolve, reject){

     var stage = 2;
     // ajax request
     getData('/0/workspace/get/data/2').then(function (response) {

     displayData(response);

     setTimeout(function() {
       resolve(); animation(stage);
     }, delay);

     }).catch(function (error) {
         reject('error: somethings wrong');
     });
   });
   return promise;
};


function finished(somestuff) {
  var promise = new Promise(function(resolve, reject) {

   setTimeout(function() {
     var stage = 3;
     resolve(); animation(stage);

     setTimeout(function() {
       load.style.display = 'none';
     }, 2100);
   }, delay);
  });
  return promise;
}

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


console.log('workspace and stack working ');


// ------ workspace ----- //

var newstack = document.getElementById('create-stack-btn');
if (newstack) { newstack.addEventListener('click', CreatenewContent); }

// ------- stacks ------- //

// add event listener to creating a new imagw upload ...

var newImage = document.getElementById('create-stack-image');
if (newImage) { newImage.addEventListener('click', CreatenewContent); }

// get images

(function () {
    axios.get('/0/workspace/get/stack/images').then(function (res) {

      var images = res.data;
      // get content to append to ...
      var parent = document.getElementById('stack-left-grid-content');

      for (var i = 0; i < images.length; i++) {

            var img = document.createElement( 'img' );
            img.classList.add( 'stack-img' );
            img.src ='/image/' + images[i].filename;
            parent.appendChild( img );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
})();


// upload image ...

var loadFile = function(event) {
   var output = document.getElementById('image-names');
   var li = document.createElement('li');
   li.classList.add('image-preview-item');
   li.innerHTML = event.target.files[0].name;
   output.appendChild(li);
 };


/* --- team members --- */

var newstack = document.getElementById('aside-add-member-btn');
newstack.addEventListener('click', CreatenewContent );
