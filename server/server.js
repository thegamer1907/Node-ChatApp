const path = require('path');
const http = require('http');
const express = require('express');
const publicpath = path.join(__dirname, '..','/public');
const socket = require('socket.io');
var app = express();

var server = http.createServer(app);
var io = socket(server);
const port = process.env.PORT || 3000;
app.use(express.static(publicpath));

io.on('connection', (socket) => {
  console.log('New User Connected');

  // socket.emit('newMessage', {
  //   from: 'user1',
  //   text: 'hey',
  //   createdAt: 123
  // });

  socket.on('createMessage', (msg) => {
    console.log('createEmail', msg);
    io.emit('newMessage', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

});










server.listen(port, () => {
  console.log(`Server Up and Running on ${port}`);
});
