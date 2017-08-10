import Ember from 'ember';

export default Ember.Controller.extend({
  users: null,
  orders: null,
  orderUsers: null,
  member: {name: null, mail: null},

  usersFromOrders: function () {
    var users = [];
    for (var key in this.orders) {
      var order = this.orders[key];
      users.push({user: order.user});
    }
    this.set('orderUsers', users);
  },

  setupUsers: function () {
    for (var i = 0; i < this.users.length; i++) {
      Ember.set(this.users[i], 'selected' , !this.checkIfReply(this.users[i]));
      Ember.set(this.users[i], 'reply' , this.checkIfReply(this.users[i]));
    }
  },

  checkIfReply: function (user) {
    for (var i = 0; i < this.orderUsers.length; i++) {
      if(this.orderUsers[i].user.email ===  user.mail)  {
        return true;
      }
    }
    return false;
  }
});
