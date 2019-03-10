
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

    var idFind = el.target.getAttribute("data-content-new");
    var target = document.getElementById(idFind);

    target.classList.add('newcontent-show');

    var close = target.getElementsByClassName('new-contentclose-btn')[0];

    close.addEventListener('click', function() {
      var remove = document.getElementById(idFind);
      remove.classList.remove('newcontent-show');
    });
}

/* --- no content / sshow message ---- */


console.log( 'pusher working ');

(function ( ) {
    if (io) {
      var socket = io.connect();

      var space = document.querySelector('body').getAttribute('space_id');

      axios.get('/socket/required').then(function ( res ) {
          var data = { needed: res.data, spaceId: space };
          socket.emit('connected', data);
      })
      .catch(function (error) {  console.log(error) });
      
      socket.on('connectedStatus', function( data) {
            // var dataClean = String(data);
            // var idFind = el.target.getAttribute("data-content-new");
            // var target = document.getElementById(idFind);
            console.log(data);
      });
    }
})();


console.log('app-load');
var load = document.getElementById('app-load');
if (load) {

  var phrases = [ 'generating workspace members', 'grabbing your channels', ' grabbing workspace reminders' , 'grab a coffee and get working'  ];


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

  var spaceId = document.querySelector('body').getAttribute('space_id');

  return axios.get( '/0/workspace/' + spaceId + url ).then(function (response) {
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


var delay = 200;

// get needed left side content

function firstMethod () {
   var promise = new Promise(function(resolve, reject) {

      var stage = 0;
      // ajax request
      getData('/get/members').then(function ( response ) {

          var users = response.data;

          var membersParent = document.getElementById( 'aside-team' );
          var appendTo = membersParent.querySelector( 'ul' );

          users.forEach( function ( user , index ) {
              var obj = document.createElement( 'li' );
              obj.innerHTML = '<span class=member-icon> </span> <p data-member=' + user.username + '>' +  user.username + '</p>' +
              '<span class=channel-loc>' + user.role + '</span>' +
              '</p>';

              appendTo.appendChild(obj);
          });

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
     getData('/get/channels').then(function (response) {

           var channels = response.data;
           console.log( channels );

           var spaceId = document.querySelector('body').getAttribute('space_id');
           var membersParent = document.getElementById( 'aside-channels' );
           var appendTo  = membersParent.querySelector( 'ul' );

           channels.forEach( function ( channel , index ) {

               var obj = document.createElement( 'li' );
               obj.innerHTML =   '<span class=member-icon> </span> <a href=/0/workspace/' + spaceId + '/channel/' + channel.url + '/> # ' + channel.name + '</a>' +
                                  '<span class=channel-loc>' + channel.tag  + '</span>';

               console.log( appendTo , obj );

               appendTo.appendChild(obj);
           });

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
     getData('/get/reminders').then(function (response) {

     // displayData(response);

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

function submitreq() {
  var name = document.getElementById('workspace-name').value;
  var desc = document.getElementById('workspace-description').value;

  axios.post('/0/auth/workspace-new', {
    name: name,
    description: desc
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
                           '<a class=workspace-btn join-workspace href=/0/workspace/' + res.data.id + '>' + 'join workspace' + '</span>';
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

/* --- team channel --- */

var newchannel = document.getElementById('aside-add-channel-btn');
// expand new members popup
newchannel.addEventListener('click', CreatenewContent );

/* --- team members --- */

var newstack = document.getElementById('aside-add-member-btn');
// expand new members popup
newstack.addEventListener('click', CreatenewContent );
// get generated tokens when expanding new members popup
newstack.addEventListener('click', GetAllTokens);

var space = document.querySelector('body').getAttribute('space_id');

// get all tokens generated by workspace
function GetAllTokens() {

    var appendTo = document.getElementById('member-tokens-assigned');

    axios.get('/0/workspace/'+ space + '/getAllTokens').then(function ( res ) {

        var tokens = res.data;

        console.log(tokens);

        tokens.forEach(function( generated, index) {
              var html = document.createElement('div');
              html.classList.add('token-generated');

              generated.claimed ? html.classList.add('token-used') : html.classList.add('token-free');
              html.innerHTML = '<p>' + generated.token  + '</p>';

              appendTo.appendChild(html);
        });
    })
    .catch(function (error) {  console.log(error) });
}

// generate a single token on clicking generate token btn
function generateToken( el ) {

      axios.get('/0/workspace/'+ space + '/genToken').then(function ( res ) {

            var generated = res.data;

            // add new key to content
            var appendTo = document.getElementById('member-tokens-assigned');

            var html = document.createElement('div');
            html.classList.add('token-generated');

            generated.claimed ? html.classList.add('token-used') : html.classList.add('token-free');
            html.innerHTML = '<p>' + generated.token  + '</p>';

            appendTo.appendChild(html);
      })
      .catch(function (error) { console.log(error); });
}
