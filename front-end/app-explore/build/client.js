
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
