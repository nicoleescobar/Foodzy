import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.getMenu();
  },

  actions: {
    checkUser: function () {
      var user = firebase.auth().currentUser;
      if (user) {
        this.transitionTo("new-lunch");
      } else {
        this.transitionTo("login");
      }
    },

    logOut: function () {
      var that = this;
      firebase.auth().signOut().then(function() {
        that.transitionTo("login");
      }, function(error) {
        console.log("Error");
      });
    }
  },

  getMenu: function () {
    var controller = this.controllerFor("home");
    var database = firebase.database();
    var menu = database.ref('menu/menu').once('value').then(function(snapshot) {
      controller.set("menu", snapshot.val());
      controller.setupMenu();
    });
  },
});
