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