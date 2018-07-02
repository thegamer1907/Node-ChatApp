class Users {
  constructor () {
    this.users = [];
  }

  addUser(id,name,room) {
    var user = {id,name,room};
    this.users.push(user);
    //console.log(this.users);
    return user;
  }

  removeUser (id) {
    var user = this.users.filter((user) => user.id === id);
    user = user[0];
    //console.log(user);
    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }
    //console.log(this.users);
    return user;
  }

  getUser(id) {
    var userlist = this.users.filter((user) => user.id === id);
    return userlist[0];
  }

  getUserList (room) {
    var userlist = this.users.filter((user) => user.room === room);
    //console.log(userlist);
    var names = userlist.map((user) => user.name);
    return names;
  }
}


module.exports = {Users};
