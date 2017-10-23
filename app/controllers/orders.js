import Ember from 'ember';

export default Ember.Controller.extend({
  orders: null,
  notOrdersYet: true,
  setupOrders : function functionName() {
    if (this.orders.length === 0) {
      this.set('notOrdersYet', true);
    } else {
      this.set('notOrdersYet', false);
      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i]
        var orderDate = new Date (order.date);
        var formatedDate = orderDate.getUTCDate() + '/' +  orderDate.getUTCMonth();
        Ember.set(this.orders[i], "date", formatedDate);
      }
    }
  }
});
