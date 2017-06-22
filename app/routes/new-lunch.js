import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    if (firebase.auth().currentUser) {
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
      this.showSaved();
    }
  },

  showSaved: function () {
    var that = this;
    var controller = this.controllerFor("new-lunch");

    controller.set("isSaved", true);
    setTimeout(function() {
      that.set("controller", false);
      this.transitionTo("home");
    }, 3000)
  }
});
