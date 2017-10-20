import Ember from 'ember';

export default Ember.Route.extend({
  notificationService: Ember.inject.service('notification-service'),

  model: function () {
    this.getUserList();
    this.getOrders();
  },

  actions: {
    notifySingleUser: function (user) {
      var service = this.get("notificationService");
      var body =  {
         "notification": {
           "title": "Testing Notifications",
           "body": "Aqui el body papuuuuuh",
           "click_action": "http://localhost:4200"
         },

         "to": user.userToken
       };

       var data = JSON.stringify(body);
      service.sendSingleNotification(data);
    }
  },

  getUserList: function () {
    var controller = this.controllerFor("notify");
    firebase.database().ref('users').once('value', function(snapshot) {
      var users = snapshot.val();
      if (Ember.isPresent(users)) {
        controller.set('userList', users.users)
      } else {
        controller.set('userList', null);
      }
    });
  },

  getOrders: function () {
    var controller = this.controllerFor("notify");
    var database = firebase.database();
    database.ref('orders').once('value').then(function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.setupOrders();
      controller.loadUsersProfile();
    });
  },

});
