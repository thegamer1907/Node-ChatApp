var socket = io();

function scrolltobottom() {
  var messages = jQuery('#messages');
  var newmsg = messages.children('li:last-child');
  var clienth = messages.prop('clientHeight');
  var scrolltop = messages.prop('scrollTop');
  var scrollh = messages.prop('scrollHeight');
  var newmsgh = newmsg.innerHeight();
  var lastmsgh = newmsg.prev().innerHeight();
  if(clienth + scrolltop + newmsgh + lastmsgh >= scrollh){
    messages.scrollTop(scrollh);
  }
}


socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err){
    if(err)
    {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error!');
    }
  });

});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  console.log(users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user))
  });

  jQuery('#Users').html(ol);
});


socket.on('newMessage', function(data) {
  console.log(data);
  var template = jQuery('#message-template').html();
  var formattedtime = moment(data.createdAt).format('h:mm a');
  var html = Mustache.render(template, {
    text: data.text,
    from: data.from,
    createdAt: formattedtime
  });
  jQuery('#messages').append(html);
  scrolltobottom();
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
  scrolltobottom();
});


jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var msgbox = jQuery('[name=message]');
  socket.emit('createMessage', {
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
