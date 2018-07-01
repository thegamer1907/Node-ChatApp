var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});


socket.on('newMessage', function(data) {
  var template = jQuery('#message-template').html();
  var formattedtime = moment(data.createdAt).format('h:mm a');
  var html = Mustache.render(template, {
    text: data.text,
    from: data.from,
    createdAt: formattedtime
  });
  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(msg) {
  var formattedtime = moment(msg.createdAt).format('h:mm a');
  var template = jQuery('#locationmessage-template').html();
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedtime
  });
  jQuery('#messages').append(html);
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
