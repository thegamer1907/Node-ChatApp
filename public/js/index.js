var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


socket.on('newMessage', function(data) {
  console.log('New Msg', data);
  var li = jQuery('<li></li>');
  li.text(`${data.from} : ${data.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(msg) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${msg.from} : `);
  a.attr('href',msg.url);
  li.append(a);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var msgbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: msgbox.val()
  }, function() {
     msgbox.val('');
  })
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position){
    //console.log(position);
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  })

});
