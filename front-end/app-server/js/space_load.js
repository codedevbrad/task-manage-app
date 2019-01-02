
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
