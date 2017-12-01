import Ember from 'ember';

export default Ember.Component.extend({
  isAdminUser: false,
  user: null,
  activeRoute: "/",
  users: [],
  userLastIndex: 0,
  isOpen: true,
  showMenuToggler: false,

  didReceiveAttrs: function () {
    var that = this;
    this.getUsers();
    this.set('activeRoute', this.get('router.currentRouteName'));

    that.set("isOpen", Ember.$( window ).width() > 600);
    that.set("showMenuToggler", Ember.$( window ).width() <= 600);

    Ember.$( window ).resize(function() {
        that.set("isOpen", Ember.$( window ).width() > 600);
        that.set("showMenuToggler", Ember.$( window ).width() <= 600);
    });
  },

  actions: {
    logOut: function () {
      var that = this;
      firebase.auth().signOut().then(function() {
        that.get('router').transitionTo('home');
      }, function(error) {
        console.log("Error", error);
      });
    },

    openMenu: function () {
      this.set("isOpen", true)
    },

    closeMenu: function () {
      this.set("isOpen", false)
    },
  },

  getUsers: function () {
    var that = this;
    firebase.database().ref('users').once('value', function(snapshot) {
      var users = snapshot.val();
      if (Ember.isPresent(users)) {
        that.checkUser();
        that.set('users', users);
        that.set("userLastIndex", users.length);
      } else {
        that.set('users', []);
        that.checkUser();
      }
    });
  },


  checkUser: function () {
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user.providerData[0]));
        that.set("user", user.providerData[0]);
        that.requestPermissionForNotifications(user.providerData[0]);
        that.checkAdminUsers();

      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
      }
    });
  },


  saveUser: function (user) {
    var that = this;
    if (this.users) {
      var alias = this.generateAlias(user.displayName);
      var newUser = {alias: alias, username: user.displayName, email: user.email, uid: user.uid , userToken: that.user.userToken};
      if (!that.userExist(newUser)) {
        firebase.database().ref('users/' + that.userLastIndex).set(newUser);
      }
    } else {
      setTimeout(function(){that.saveUser(user)}, 3000);
    }
  },

  checkAdminUsers: function () {
    var admins;
    var that = this;

    firebase.database().ref('/adminsUsers').once('value').then(function(snapshot) {
      admins = snapshot.val();
      for (var i = 0; i < admins.length; i++) {
        if(admins[i].email === that.user.email){
          that.set('isAdminUser', true);
        }
      }
    });
  },

  requestPermissionForNotifications: function (user) {
    var that = this;
    const messaging = firebase.messaging();
    messaging.requestPermission()
      .then(function() {
        messaging.getToken()
        .then(function(currentToken) {
          if (currentToken) {
            that.setUserToken(currentToken, user);
          } else {
            that.requestPermissionForNotifications();
          }
        });
      })
      .catch(function() {
        alert("Hola! Foodzy quiere notificarte cuando el menu del dia este listo, por favor activa las notificaciones en la configuracion de tu browser. Gracias!");
      });
  },

  setUserToken: function (token) {
    Ember.set(this.user, "userToken", token);
    this.saveUser(this.user);

  },

  userExist: function (user) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].username === user.username ) {
        return true;
      }
    }
    return false;
  },

  generateAlias: function (name) {
    var splitedName = name.split(" ");
    return `${splitedName[0]} ${splitedName[1].charAt(0)}`
  }


});
