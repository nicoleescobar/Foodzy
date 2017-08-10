import Ember from 'ember';

export default Ember.Controller.extend({
  orders: null,
  notOrdersYet: true,
  setupOrders : function functionName() {
    var orders=[];
    for (var key in this.orders) {
      var order = this.orders[key];
      var orderDate = new Date (order.date);
      var formatedDate = orderDate.getUTCDate() + '/' +  orderDate.getUTCMonth();
      orders.push({user: order.user, date: formatedDate, order: order.order});
    }
    this.set('orders', orders);
    if (orders.length === 0) {
      this.set('notOrdersYet', true);
    } else {
      this.set('notOrdersYet', false);
    }
  }
});
