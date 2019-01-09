
console.log('app-load');
var load = document.getElementById('app-load');
if (load) {

  var phrases = [ 'fetching needed data', 'generating workspace members', 'grabbing your channels', 'grab a coffee and get working'];

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

function getData() {
  axios.get('/0/workspace/get/data').then(function (response) {
      console.log(response);
  }).catch(function (error) { });
}



function checkErrors(resolve, reject, stage) {
    var error = false;
    if (!error) { resolve(); animation(stage) }
    else        { reject('error: somethings wrong');      }
}

function animation (currEl) {
     var element = document.getElementById('populate-load');
     var current = element.childNodes[currEl];

     var tick = current.getElementsByClassName('load-left')[0];

     tick.innerHTML = ' <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';

     current.classList.add('load-in-view');

}

var delay = 1100;

function firstMethod () {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        var stage = 0;
        checkErrors( resolve, reject, stage);
      }, delay);
   });
   return promise;
};


function secondMethod (someStuff) {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        var stage = 1;
        checkErrors( resolve, reject, stage);
      }, delay);
   });
   return promise;
};

function thirdMethod (someStuff) {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        var stage = 2;
        checkErrors( resolve, reject, stage);
      }, delay);
   });
   return promise;
};

function finished(somestuff) {
  var promise = new Promise(function(resolve, reject){
     setTimeout(function() {
       var stage = 3;
       checkErrors( resolve, reject, stage);
       setTimeout(function() {
         load.style.display = 'none';
       }, 2100);
     }, delay);
  });
  return promise;
}
