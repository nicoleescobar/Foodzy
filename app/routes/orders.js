import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.loadOrders();
  },

  loadOrders: function () {
    var controller = this.controllerFor("orders");
    var database = firebase.database();
    var orders = database.ref('orders');
    orders.on('value', function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.setupOrders();
    });
  },
});
