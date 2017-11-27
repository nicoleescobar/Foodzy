import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.loadOrders();
  },

  cleanController: function () {
    var controller = this.controllerFor("orders");
    controller.cleanController();
  }.on('deactivate'),

  loadOrders: function () {
    var controller = this.controllerFor("orders");
    var database = firebase.database();

    var todayRef =  new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();
    controller.set('ordersDate', todayRef);
    var orders = database.ref('/orders/'+todayRef);

    orders.on('value', function(snapshot) {
      controller.set("orders", snapshot.val());
      controller.set("numberSoups", 0 );
      controller.set("numberDrinks", 0 );
      controller.setupOrders();
    });
  },
});
