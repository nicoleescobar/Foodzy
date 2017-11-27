import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    this.checkUser();
    this.getMenu();
  },

  cleanController: function () {
    var controller = this.controllerFor("home");
    controller.cleanController();
  }.on('deactivate'),

  setController: function () {
    var controller = this.controllerFor("home");
    controller.cleanController();
  }.on('activate'),

  getMenu: function () {
    var controller = this.controllerFor("home");
    var todayRef =  new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();
    var database = firebase.database();
    controller.set('showLoading', true);

    database.ref('menus/' + todayRef).once('value').then(function(snapshot) {
      var menu = snapshot.val();
      if (Ember.isPresent(menu)) {
        controller.set("menu", menu);
        controller.set('showLoading', false);
        controller.setupMenu();
      } else {
        controller.set("noMenuToday", true);
        controller.set('showLoading', false);
      }

    });
  },

  checkIfOrder:function () {
    var cont = 0;
    var user = JSON.parse(localStorage.getItem("user"));
    var menuSelected = null;
    var controller = this.controllerFor("home");
    if (Ember.isPresent(controller.ordersFilled)) {
      for (var i = 0;  i < controller.ordersFilled.length ; i++) {
        var mail = controller.ordersFilled[i].user.email;
        if (mail === user.email) {
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
    var todayRef =  new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();
    var orders = firebase.database().ref('/orders/'+todayRef);

    orders.on('value', function(snapshot) {
      var orders = snapshot.val();
      controller.set('ordersFilled', orders);
      controller.set('orderLastIndex', Ember.isPresent(orders) ? orders.length : 0 );
      that.checkIfOrder();
    });
  },

  checkUser: function () {
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user.providerData[0]));
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
      }
    });

    this.getOrders();

  },



});
