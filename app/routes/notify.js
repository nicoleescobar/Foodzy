import Ember from 'ember';

export default Ember.Route.extend({
  notificationService: Ember.inject.service('notification-service'),

  model: function () {
    this.getUserList();
    this.getOrders();
  },

  actions: {
    notifySingleUser: function (user) {
       this.sendNotification(user);
    },

    notifyUnansweredUsers: function () {
      var controller = this.controllerFor("notify");
      for (var i = 0; i < controller.userList.length; i++) {
        var user = controller.userList[i];
        if (!user.responded) {
          this.sendNotification(user);
        }
      }
    }
  },

  getUserList: function () {
    var controller = this.controllerFor("notify");
    firebase.database().ref('users').once('value', function(snapshot) {
      var users = snapshot.val();
      if (Ember.isPresent(users)) {
        controller.set('userList', users);
      } else {
        controller.set('userList', null);
      }
    });
  },

  getOrders: function () {
    var controller = this.controllerFor("notify");
    var database = firebase.database();
    var orders = database.ref('orders');
    orders.on('value', function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.setupOrders();
      controller.loadUsersProfile();
    });
  },

  sendNotification: function (user) {
    var service = this.get("notificationService");
    var body =  {
       "notification": {
         "title": "Hola " + user.username + "!",
         "body": "Por favor, marca tu almuerzo.",
         "click_action": "http://localhost:4200"
       },

       "to": user.userToken
     };

     var data = JSON.stringify(body);
     service.sendSingleNotification(data);
  }

});
