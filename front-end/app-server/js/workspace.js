
console.log('workspace and stack working ');


// ------ workspace ----- //

var newstack = document.getElementById('create-stack-btn');
if (newstack) { newstack.addEventListener('click', CreatenewContent); }


// ------- stacks ------- //

// add event listener to creating a new image upload ...

var newImage = document.getElementById('create-stack-image');
if (newImage) { newImage.addEventListener('click', CreatenewContent); }

// get images

(function () {

    var space = document.querySelector('body').getAttribute('body_data_id');

    console.log( space );

    axios.get('/0/workspace/stack/images/'+space).then(function (res) {

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
