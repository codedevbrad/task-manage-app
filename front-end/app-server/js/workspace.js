
console.log('workspace and stack working ');

function CreatenewContent(el) {

    console.log(el.target);

    var togglenewstack = document.getElementById('workspace-new-stack-popup');
    togglenewstack.classList.toggle('newstack-show');
}

// ------ workspace ----- //

var newstack = document.getElementById('create-stack-btn');
if (newstack) { newstack.addEventListener('click', CreatenewContent); }


// ------- stacks ------- //

// add event listener to creating a new imagw upload ...

var newImage = document.getElementById('create-stack-image');
if (newImage) { newImage.addEventListener('click', CreatenewContent); }

// upload image ...

var loadFile = function(event) {
   var output = document.getElementById('image-names');
   var li = document.createElement('li');
   li.classList.add('image-preview-item');
   li.innerHTML = event.target.files[0].name;
   output.appendChild(li);
 };
