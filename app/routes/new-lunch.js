import Ember from 'ember';

export default Ember.Route.extend({
  notificationService: Ember.inject.service('notification-service'),

  model: function () {
    this.getUserList();
  },

  actions: {
    saveMenu: function () {
      var controller = this.controllerFor("new-lunch");
      var date = new Date().toString();
      Ember.set(controller.menu, "menuDate", date);

      if (this.validMenu(controller.menu)) {
        controller.set('showLoading', true);
        var database = firebase.database();
        database.ref('menu').set({
          menu : controller.menu
        });
        database.ref('orders').set({});
        this.showSaved();
        this.notify();
      } else {
        controller.showIncompleteMenu();
      }
    }
  },

  validMenu: function (menu) {
     var validMenu = Ember.isPresent(menu.accomps[0].name) &&
                     Ember.isPresent(menu.addition[0].name) &&
                     Ember.isPresent(menu.protein[0].name)
     return validMenu;
  },

  showSaved: function () {
    var that = this;
    var controller = this.controllerFor("new-lunch");
    controller.set("isSaved", true);
    setTimeout(function() {
      controller.set("isSaved", false);
      controller.clearController();
      that.transitionTo("home");
    }, 3000);
  },

  getUserList: function () {
    var controller = this.controllerFor("new-lunch");
    var users = firebase.database().ref('users');
    users.on('value', function(snapshot) {
      var users = snapshot.val();
      controller.set('userList', users.users);
    });
  },

  notify: function () {
    var controller = this.controllerFor("new-lunch");
    for (var i = 0; i < controller.userList.length; i++) {
      var user = controller.userList[i];
      if (!user.responded) {
        this.sendNotification(user);
      }
    }
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
