import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.loadOrders();
  },

  loadOrders: function () {
    var controller = this.controllerFor("orders");
    var database = firebase.database();
    database.ref('orders').once('value').then(function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.setupOrders();
    });
  },
});
