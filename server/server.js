const path = require('path');
const http = require('http');
const express = require('express');
const publicpath = path.join(__dirname, '..','/public');
const socket = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');

var app = express();

var server = http.createServer(app);
var io = socket(server);
const port = process.env.PORT || 3000;
app.use(express.static(publicpath));

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  socket.on('createMessage', (msg, callback) => {
    console.log('createEmail', msg);
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    callback();
  });

  socket.on('createLocation', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

});










server.listen(port, () => {
  console.log(`Server Up and Running on ${port}`);
});
