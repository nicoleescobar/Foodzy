import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    var user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      this.transitionTo("new-lunch");
    } else {
      this.transitionTo("login");
    }
  },

  actions: {
    saveMenu: function () {
      var controller = this.controllerFor("new-lunch");
      var date = new Date().toString();
      Ember.set(controller.menu, "menuDate", date);
      //add Validation
      var database = firebase.database();
      database.ref('menu').set({
        menu : controller.menu
      });
    }
  }
});
