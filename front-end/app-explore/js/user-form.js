
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
  axios.get('/user/auth/username/'+val, {
  })
  .then(function (res) {
    var textInput = document.getElementById('auth-username');
    textInput.style.borderColor = res.data;
  })
  .catch(function (error) {
  });
}
