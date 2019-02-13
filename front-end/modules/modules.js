
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
