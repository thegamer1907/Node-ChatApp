const path = require('path');
const http = require('http');
const express = require('express');
const publicpath = path.join(__dirname, '..','/public');
const socket = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isreals} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
var app = express();

var server = http.createServer(app);
var io = socket(server);
var users = new Users();
const port = process.env.PORT || 3000;
app.use(express.static(publicpath));

io.on('connection', (socket) => {
  console.log('New User Connected');


  socket.on('join',(params,callback) => {
    params.room = params.room.toLowerCase();
    var names = users.getUserList(params.room);
    // console.log(users.getRoomlist());
    var isval = names.filter((name) => name === params.name);
    if(!isreals(params.name) || !isreals(params.room))
    {
      return callback('Name and room name are required');
    } else if(isval.length > 0) {
      return callback('Name is already taken');
    }
    else {
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has Joined`));
      callback();
    }
  });




  socket.on('createMessage', (msg, callback) => {
    var user = users.getUser(socket.id);
    if(user && isreals(msg.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
      callback();
    }
  });

  socket.on('createLocation', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,coords.latitude,coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left!`));
    }
  });

  socket.on('getRoomlist', (no,callback) => {
    var rooms = users.getRoomlist();
    callback(rooms);
  });

});




server.listen(port, () => {
  console.log(`Server Up and Running on ${port}`);
});
