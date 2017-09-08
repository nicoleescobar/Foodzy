import Ember from 'ember';

export default Ember.Route.extend({
  users: null,

  model: function () {
    var that = this;
    var controller = this.controllerFor("home");

    this.getUsers();
    this.checkUser();
    this.getOrders();

    messaging.requestPermission()
      .then(function() {
      })
      .catch(function() {
        controller.set('showDeniedNotifications', true);
      });

    messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
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
        that.saveUser(user);
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
  },

  saveUser: function (user) {
    var that = this;
    if (this.users) {
      var newUser = {username: user.displayName, email: user.email, uid: user.uid};
      if (!that.userExist(newUser)) {
        var users = this.get('users');
        users.push(newUser);
        firebase.database().ref('users').set({users});
      }
    } else {
      setTimeout(function(){ that.saveUser(user) }, 3000);
    }
  },

  getUsers: function () {
    var that = this;
    firebase.database().ref('users').once('value', function(snapshot) {
      var users = snapshot.val();
      if (Ember.isPresent(users)) {
        that.set('users', users.users)
      } else {
        that.set('users', []);
      }
    });
  },

  userExist: function (user) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].username === user.username ) {
        return true;
      }
    }
    return false;
  },

  getToken: function () {
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        console.log(currentToken);
      } else {
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

});
