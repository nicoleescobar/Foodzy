import Ember from 'ember';

export default Ember.Controller.extend({
  users: null,
  orders: null,
  userList: null,

  setupOrders : function functionName() {
    var orders=[];
    for (var key in this.orders) {
      var order = this.orders[key];
      var orderDate = new Date (order.date);
      var formatedDate = orderDate.getUTCDate() + '/' +  orderDate.getUTCMonth();
      orders.push({user: order.user, date: formatedDate, order: order.order});
    }
    this.set('orders', orders);
  },

  loadUsersProfile: function () {
    for (var i = 0; i < this.userList.length; i++) {
      this.userList[i].responded = this.userHasResponded(this.userList[i]);
    }
  },

  userHasResponded: function (user) {
    for (var i = 0; i < this.orders.length; i++) {
      var order = this.orders[i];
      if (order.user.email === user.email) {
        return true;
      }
    }
    return false;
  }


});
