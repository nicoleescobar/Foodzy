import Ember from 'ember';

export default Ember.Controller.extend({
  user: null,
  menu: [],
  order: {
    protein: null,
    accomps: [],
    addition: null,
    soup: false,
    drink: false
  },
  showSoup: false,
  showDrink: false,
  showLoadingGreet: false,
  showAdminSettings: false,
  hideMenu: true,
  ordersFilled: null,
  showLoading: true,
  showDeniedNotifications: false,
  orderedLunch: null,
  orderLastIndex: 0,
  userLastIndex: 0,

  actions: {
    closesDeniedNotifications: function () {
      this.set('showDeniedNotifications', false);
    },

    saveOrder: function () {
      var soupChecbox = Ember.$("#soupCheck").prop( "checked" );
      var drinkCheckbox = Ember.$("#drinkCheck").prop( "checked" );
      Ember.set(this.order, "drink", Ember.isPresent(drinkCheckbox) ? drinkCheckbox : false);
      Ember.set(this.order, "soup", Ember.isPresent(soupChecbox) ? soupChecbox : false);
      this.deliverOrder();
    },

    selectProtein: function(protein) {
      Ember.set(this.order, "protein", protein);
    },

    selectAccomp: function(accomp, index) {
      var isSelected = Ember.$("#"+accomp.id).prop( "checked" );
      if (isSelected) {
        var accomps = this.order.accomps;
        accomps.push(accomp.name);
        Ember.set(this.order, "accomps", accomps);
      } else {
        this.deleteFromAccomps(index);
      }
    },

    selectAddition: function(addition) {
      Ember.set(this.order, "addition", addition);
    }
  },

  deleteFromAccomps: function ( index) {
    var propVector = this.order.accomps;
    Ember.set(this.order, "accomps", propVector.splice(index, 1));
  },

  setupMenu: function () {
    var menu = this.menu;
    var that = this;
    if (Ember.isPresent(menu.soup)) {
      this.set("showSoup", true);
      var soup = menu.soup;
      if (soup.indexOf('sopa')||soup.indexOf('Sopa')) {
        var splitsuop = soup.split(' ');
        Ember.set(that.menu, 'soup', splitsuop[splitsuop.length - 1]);
      }
    }
    if (Ember.isPresent(menu.drink)) {
      this.set("showDrink", true);
    }
  },

  deliverOrder: function () {
    this.set('hideMenu', true);
    this.set("orderedLunch", this.order);
    var order = {
      user: this.user,
      order: this.order,
      date: new Date().toString(),
    };
    firebase.database().ref('orders/' + this.orderLastIndex).set(order);
  },

  cleanController: function () {
    this.set('user', null);
    this.set('menu', []);
    this.set('showSoup', false);
    this.set('showDrink', false);
    this.set('showLoadingGreet', false);
    this.set('showAdminSettings', false);
    this.set('hideMenu', true);
    this.set('ordersFilled', null);
    this.set('showLoading', true);
    this.set('showDeniedNotifications', false);
  }
});
