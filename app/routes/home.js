import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    this.getOrders();
    this.getMenu();
  },

  cleanController: function () {
    var controller = this.controllerFor("home");
    controller.cleanController();
  }.on('deactivate'),

  getMenu: function () {
    var controller = this.controllerFor("home");
    var database = firebase.database();
    controller.set('showLoading', true);
    database.ref('menu/menu').once('value').then(function(snapshot) {
      controller.set("menu", snapshot.val());
      controller.set('showLoading', false);
      controller.setupMenu();
    });
  },

  checkIfOrder:function () {
    var cont = 0;
    var menuSelected = null;
    var controller = this.controllerFor("home");
    if (Ember.isPresent(controller.ordersFilled)) {
      for (var i = 0;  i < controller.ordersFilled.length ; i++) {
        console.log(controller.user, controller.ordersFilled[i]);

        var mail = controller.ordersFilled[i].user.email;
        if (mail === controller.user.email) {
          cont = cont + 1;
          menuSelected = controller.ordersFilled[i].order;
        }
      }
    }
    controller.set('showLoading', false);
    controller.set('hideMenu', cont > 0);
    controller.set('orderedLunch', menuSelected);
  },

  getOrders: function () {
    var controller = this.controllerFor("home");
    var that = this;
    var orders = firebase.database().ref('/orders')
    orders.on('value', function(snapshot) {
      var orders = snapshot.val();
      controller.set('ordersFilled', orders);
      controller.set('orderLastIndex', Ember.isPresent(orders) ? orders.length : 0 );
      that.checkIfOrder();
    });
  },



});
