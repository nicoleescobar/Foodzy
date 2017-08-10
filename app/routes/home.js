import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.checkUser();
    this.getOrders();
    const messaging = firebase.messaging();
    messaging.requestPermission();

    messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      // ...
    });
  },

  cleanController: function () {
    var controller = this.controllerFor("home");
    controller.cleanController();
  }.on('deactivate'),

  getMenu: function () {
    var controller = this.controllerFor("home");
    var database = firebase.database();
    database.ref('menu/menu').once('value').then(function(snapshot) {
      controller.set("menu", snapshot.val());
      controller.set('showLoading', false);
      controller.setupMenu();
    });
  },

  checkUser: function () {
    var that = this;
    var controller = this.controllerFor("home");
    controller.set('showLoading', true);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        controller.set('user', user.providerData[0]);
        that.getMenu();
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
      }
    });
  },

  checkIfOrder:function () {
    var cont = 0;
    var controller = this.controllerFor("home");
    for (var prop in controller.ordersFilled) {
      var mail = controller.ordersFilled[prop].user.email;
      if (mail === controller.user.email) {
        cont = cont + 1;
      }
    }
    controller.set('showLoading', false);
    controller.set('hideMenu', cont > 0);
  },

  getOrders: function () {
    var controller = this.controllerFor("home");
    var that = this;
    firebase.database().ref('/orders').once('value').then(function(snapshot) {
      var orders = snapshot.val();
      controller.set('ordersFilled', orders);
      that.checkIfOrder();
    });
  }
});
