import Ember from 'ember';

export default Ember.Controller.extend({
  users: null,
  orders: null,
  userList: null,

  setupOrders : function functionName() {
    if (Ember.isPresent(this.orders)) {
      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i]
        var orderDate = new Date (order.date);
        var formatedDate = orderDate.getUTCDate() + '/' +  orderDate.getUTCMonth();
        Ember.set(this.orders[i], "date", formatedDate);
      }
    }
  },

  loadUsersProfile: function () {
    if (Ember.isPresent(this.userList)) {
      for (var i = 0; i < this.userList.length; i++) {
        Ember.set(this.userList[i], "responded" ,this.userHasResponded(this.userList[i]));
      }
    }
  }.observes('orders', 'userList'),

  userHasResponded: function (user) {
    if (Ember.isPresent(this.orders)) {
      for (var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i];
        if (order.user.email === user.email) {
          return true;
        }
      }
      return false;
    }
  }


});
