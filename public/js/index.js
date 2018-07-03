var socket = io();



socket.on('connect', function() {
  socket.emit('getRoomlist',{},function(rooms) {
    var sel = jQuery('#roomlist');
    rooms.forEach(function(room) {
      sel.append(jQuery('<option></option>').text(room).attr('value',room));
    });
  });
});
