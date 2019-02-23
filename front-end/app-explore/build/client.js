
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


console.log('test');

// Get the input box
var textInput = document.getElementById('auth-username');

// Init a timeout variable to be used below
var timeout = null;

// Listen for keystroke events
textInput.onkeyup = function (e) {

    clearTimeout(timeout);

    timeout = setTimeout(function () {

      if (textInput.value.length > 5) {
        console.log('Input Value:', textInput.value);
        axiosrequest(textInput.value);
      }
    }, 400);
};


function axiosrequest(val) {
  axios.post('/user/auth/username/'+val, {

  }).then(function (res) {

      var errorInput = document.getElementById('auth-username');
      var errorText  = document.getElementById('error-username');

      errorInput.className = '';

      // add needed classes
      errorInput.classList.add(res.data.class + '-input');
      errorInput.classList.add( 'form-control' );
      errorText.innerHTML = '<p class=' + res.data.class + '-text' + '>' + res.data.msg + '</p>';
  })
  .catch(function (error) {
  });
}


//
