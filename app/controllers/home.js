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

  actions: {
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
    if (Ember.isPresent(menu.soup)) {
      this.set("showSoup", true);
    }
    if (Ember.isPresent(menu.drink)) {
      this.set("showDrink", true);
    }
  },

  deliverOrder: function () {
    this.set('showLoadingGreet', true);
    var order = {
      user: this.user,
      order: this.order,
      date: new Date().toString(),
    };
    firebase.database().ref('orders').push(order);
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
  }
});
