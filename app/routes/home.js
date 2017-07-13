import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.checkUser();
    this.getOrders();
    const messaging = firebase.messaging();
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  },

  cleanController: function () {
    var controller = this.controllerFor("home");
    controller.cleanController();
  }.on('deactivate'),

  actions: {
    logOut: function () {
      var that = this;
      firebase.auth().signOut().then(function() {
        that.transitionTo('home');
      }, function(error) {
        console.log("Error", error);
      });
    }
  },

  getMenu: function () {
    var controller = this.controllerFor("home");
    var database = firebase.database();
    database.ref('menu/menu').once('value').then(function(snapshot) {
      controller.set("menu", snapshot.val());
      controller.setupMenu();
    });
  },

  checkUser: function () {
    var that = this;
    var controller = this.controllerFor("home");
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        controller.set('user', user.providerData[0]);
        that.checkAdminUsers();
        that.getMenu();
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
      }
    });
  },

  checkAdminUsers: function () {
    var admins;
    var controller = this.controllerFor("home");
    firebase.database().ref('/adminsUsers').once('value').then(function(snapshot) {
      admins = snapshot.val();
      for (var i = 0; i < admins.length; i++) {
        if(admins[i].email === controller.user.email){
          controller.set('showAdminSettings', true);
        }
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
