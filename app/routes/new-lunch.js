import Ember from 'ember';

export default Ember.Route.extend({
  notificationService: Ember.inject.service('notification-service'),

  model: function () {
    this.getUserList();
    this.loadLastMenu();
  },

  actions: {
    saveMenu: function () {
      var controller = this.controllerFor("new-lunch");
      var date = new Date().toString();
      var menuRef = new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();
      Ember.set(controller.menu, "menuDate", date);
      if (this.validMenu(controller.menu)) {
        controller.set('showLoading', true);
        var database = firebase.database();
        database.ref('menus/' + menuRef).set(controller.menu);
        database.ref('orders/' + menuRef).set({});

        this.showSaved();
        this.notify();
      } else {
        controller.showIncompleteMenu();
      }
    }
  },

  loadLastMenu: function(){
    var controller = this.controllerFor("new-lunch");
    var database = firebase.database();
    var orders = database.ref('/menus');

    orders.on('value', function(snapshot) {
      var menus = snapshot.val();
      var menusDates = [];
      for (var item in menus) {
        menusDates.push(item);
      }
      var menu = menus[menusDates[menusDates.length - 1]]
      controller.set("addSoup",Ember.isPresent(menu.soup));
      controller.set("addDrink", Ember.isPresent(menu.drink));
      controller.set("menu", menu);

      Ember.$("#drinkCheck").prop('checked', Ember.isPresent(menu.drink));
      Ember.$("#soupCheck").prop('checked', Ember.isPresent(menu.soup));
    });
  },

  validMenu: function (menu) {
    var controller = this.controllerFor("new-lunch");
     var validMenu = Ember.isPresent(menu.accomps[0].name) &&
                     Ember.isPresent(menu.additions[0].name) &&
                     Ember.isPresent(menu.proteins[0].name);

    if (controller.addSoup || controller.addDrink) {
      if (Ember.isEmpty(menu.soup)) {
        controller.showError("addSoupError");
      }

      if (Ember.isEmpty(menu.drink)) {
        controller.showError("addDrinkError");
      }

      if (Ember.isPresent(menu.drink) && Ember.isPresent(menu.soup)) {
        return validMenu;
      }
    } else {
      return validMenu;
    }
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
      controller.set('userList', users);
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
         "click_action": "https://foodzy-4542c.firebaseapp.com",
         "icon": "../assets/images/animations/bellcut.gif",

       },

       "to": user.userToken
     };
     var data = JSON.stringify(body);
     service.sendSingleNotification(data);
  }

});
