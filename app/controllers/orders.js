import Ember from 'ember';

export default Ember.Controller.extend({
  orders: null,
  notOrdersYet: false,
  ordersDate: null,
  numberSoups: 0,
  numberDrinks: 0,

  setupOrders : function functionName() {
    if (this.orders.length === 0) {
      this.set('notOrdersYet', true);
    } else {
      this.set('notOrdersYet', false);
      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i]
        if(order.order.soup) {
          this.set("numberSoups", this.numberSoups + 1 );
        }
        if(order.order.drink) {
          this.set("numberDrinks", this.numberDrinks + 1 );
        }
      }
    }
  },

  cleanController: function () {
    this.set('orders', null);
    this.set('notOrdersYet', false);
    this.set('ordersDate', null);
    this.set('numberSoups', 0);
    this.set('numberDrinks', 0);
  }
});
