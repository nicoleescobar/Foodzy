import Ember from 'ember';

export default Ember.Controller.extend({
  orders: null,
  setupOrders : function functionName() {
    var orders=[];
    for (var key in this.orders) {
      var order = this.orders[key];
      var orderDate = new Date (order.date);
      var formatedDate = orderDate.getUTCDate() + '/' +  orderDate.getUTCMonth();
      orders.push({user: order.user, date: formatedDate, order: order.order});
    }
    console.log(orders);
    this.set('orders', orders);
  }
});
