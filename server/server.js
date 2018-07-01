const path = require('path');
const http = require('http');
const express = require('express');
const publicpath = path.join(__dirname, '..','/public');
const socket = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isreals} = require('./utils/validation.js');
var app = express();

var server = http.createServer(app);
var io = socket(server);
const port = process.env.PORT || 3000;
app.use(express.static(publicpath));

io.on('connection', (socket) => {
  console.log('New User Connected');


  socket.on('join',(params,callback) => {
    if(!isreals(params.name) || !isreals(params.room))
    {
      callback('Name and room name are required');
    } else {

      socket.join(params.room);

      socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has Joined`));
      callback();
    }
  });




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
