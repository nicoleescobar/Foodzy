import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {

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
      database.ref('orders').set({});
      this.showSaved();
    }
  },

  showSaved: function () {
    var that = this;
    var controller = this.controllerFor("new-lunch");

    controller.set("isSaved", true);
    setTimeout(function() {
      controller.set("isSaved", false);
      that.transitionTo("home");
    }, 3000);
  }
});
