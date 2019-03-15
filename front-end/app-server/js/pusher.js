
console.log( 'pusher working ');

(function ( ) {
    if (io) {
      var socket = io.connect();

      var space = document.querySelector( 'body' ).getAttribute( 'space_id' );
      var team  = document.getElementById( 'team-list' ).getElementsByTagName('li');

      axios.get('/socket/required').then(function ( res ) {
          var data = { needed: res.data, spaceId: space };
          socket.emit('connected', data);
      })
      .catch(function (error) {  console.log(error) });

      socket.on('testSocket', function( data) { console.log( data ); });

      // connectionIsActive = client should know all members active in a space
      socket.on('connectionIsActive', function( data ) {
          // data  = array of usernames
          // team = li list atrribute of data team member
          // loop through team list, if indexOf attribute in the data array.
          for ( var i = 0; i < team.length; i++ ) {
               var id = String(team[i].getAttribute('data-space-member'));
               if ( data.logged.indexOf(id) >= 0 ) {  team[i].classList.add( data.class ); }
          };
      });

      // connectionState    = each members of space should be notified of a client connection to space
      socket.on('connectionState', function( data) {
          var activeState  = data.class;
          var memberState  = data.user;
          console.log( memberState , activeState );

          for ( var i = 0; i < team.length; i++ ) {
               var listMember = String(team[i].getAttribute('data-space-member'));
               if ( listMember === memberState ) {
                  team[i].className = '';
                  team[i].classList.add( activeState );
               }
          };
      });

      // pusher channels
      var channel = document.getElementById( 'space-channel' );
      if (channel) {
         // socket for channels
         var id = channel.getAttribute( 'channel-id' );

         var msgForm = document.getElementById('channel-message-form');
         var msgSub  = msgForm.getElementsByTagName('input')[0];

         msgSub.addEventListener('click', function( e ) {
            var msg = msgForm.getElementsByTagName('textarea')[0];
            socket.emit( 'channel-message', { channel: id, msg: msg.value } );
         });

         // emit a message to a channel
         socket.on( 'memberMsg' , function ( data ) {

             var emitTo = document.getElementById( 'channel-msg-list' );
             var msgElement = document.createElement('li');
             msgElement.innerHTML = '<span class=space-action>' + data.user + ' </span> ' + data.msg;
             emitTo.appendChild( msgElement );
         });
      }
    }
})();

//
