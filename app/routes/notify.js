import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.loadUsers();
    this.loadUsersToNotify();
  },

  actions: {
    addMember: function () {
      var controller = this.controllerFor("notify");
      var that = this;
      if(Ember.isPresent(controller.member.name)&&Ember.isPresent(controller.member.mail)){
        controller.users.push(controller.member);
        firebase.database().ref('users').set(controller.users);
        that.loadUsers();
        that.loadUsersToNotify();
      }
      controller.set('member', {name: null, mail: null},)
    }
  },

  loadUsers: function () {
    var controller = this.controllerFor("notify");
    var database = firebase.database();
    database.ref('users').once('value').then(function(snapshot) {
      controller.set("users", snapshot.val());
    });
  },

  loadUsersToNotify: function () {
    var controller = this.controllerFor("notify");
    var database = firebase.database();
    database.ref('orders').once('value').then(function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.usersFromOrders();
      controller.setupUsers();
    });
  },


});
