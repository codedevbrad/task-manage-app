
console.log('workspace working ');

function Createnewstack(el) {

    console.log('test');

    var togglenewstack = document.getElementById('workspace-new-stack-popup');
    togglenewstack.classList.toggle('newstack-show');

    // var stacknewbox = document.createElement('div');
    //
    // var value = document.getElementById('newstack-name').value;
    // var desc  = document.getElementById('newstack-desc').value;
    // var spaceID = document.getElementsByTagName('body')[0].getAttribute('body_data_id');
    //
    // axios.post('/0/auth/workspace/stack/new', { stackname: value, spaceID: spaceID })
    // .then(function  (res) { })
    // .catch(function (error) { console.log(error) });
}

var newstack = document.getElementById('create-stack-btn');

if (newstack) { newstack.addEventListener('click', Createnewstack); }
