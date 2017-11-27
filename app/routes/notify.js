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
        controller.loadUsersProfile();
      } else {
        controller.set('userList', null);
      }
    });
  },

  getOrders: function () {
    var controller = this.controllerFor("notify");
    var todayRef =  new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();
    var orders = firebase.database().ref('/orders/'+todayRef);
    orders.on('value', function(snapshot) {
      var orders = Ember.isPresent(snapshot.val()) ? snapshot.val() : [] ;
      Ember.set(controller, "orders", orders);
      controller.setupOrders();
    });
  },

  sendNotification: function (user) {
    var service = this.get("notificationService");
    var body =  {
       "notification": {
         "title": "¡Hola " + user.username + "!",
         "body": "Por favor, marca tu almuerzo.",
         "click_action": "https://foodzy-4542c.firebaseapp.com/",
         "icon": "../assets/images/animations/waiter.png",
       },

       "to": user.userToken
     };
     var data = JSON.stringify(body);
     service.sendSingleNotification(data);
  }

});
