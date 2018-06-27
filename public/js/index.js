var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   to: 'user2',
  //   text: 'hey'
  // });

});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


socket.on('newMessage', function(data) {
  console.log('New Msg', data);
});
