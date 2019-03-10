
console.log( 'pusher working ');

(function ( ) {
    if (io) {
      var socket = io.connect();

      var space = document.querySelector('body').getAttribute('space_id');

      axios.get('/socket/required').then(function ( res ) {
          var data = { needed: res.data, spaceId: space };
          socket.emit('connected', data);
      })
      .catch(function (error) {  console.log(error) });
      
      socket.on('connectedStatus', function( data) {
            // var dataClean = String(data);
            // var idFind = el.target.getAttribute("data-content-new");
            // var target = document.getElementById(idFind);
            console.log(data);
      });
    }
})();
