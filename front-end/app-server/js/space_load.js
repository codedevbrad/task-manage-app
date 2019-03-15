
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
              obj.setAttribute( 'data-space-member', user.username );
              obj.innerHTML = '<span class=member-icon> </span> <p>' +  user.username + '</p>' +
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
