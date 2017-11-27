import Ember from 'ember';

export default Ember.Controller.extend({
  user: JSON.parse(localStorage.getItem("user")),
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
  showSelectFoodModal: false,
  orderedLunch: null,
  orderLastIndex: 0,
  noMenuToday: false,


  actions: {
    closeModal: function () {
      this.set('showSelectFoodModal', false);
    },

    saveOrder: function () {
      var soupChecbox = Ember.$("#soupCheck").prop( "checked" );
      var drinkCheckbox = Ember.$("#drinkCheck").prop( "checked" );
      Ember.set(this.order, "drink", Ember.isPresent(drinkCheckbox) ? drinkCheckbox : false);
      Ember.set(this.order, "soup", Ember.isPresent(soupChecbox) ? soupChecbox : false);
      this.validateOrder();
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
    },

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

   this.set("menu", menu);
  },

  deliverOrder: function () {
    this.set("orderedLunch", this.order);
    this.set('hideMenu', true);
    var todayRef =  new Date().getUTCDate() + "-" + (new Date().getUTCMonth()+ 1) + "-" + new Date().getUTCFullYear();

    var order = {
      user: this.user,
      order: this.order,
      date: new Date().toString(),
    };
    firebase.database().ref('orders/' + todayRef + '/' + this.orderLastIndex).set(order);
  },

  validateOrder: function () {
    var orderIsEmpty = this.order.accomps.length === 0 &&
                      !Ember.isPresent(this.order.addition) &&
                      !Ember.isPresent(this.order.protein) &&
                      !this.order.drink && !this.order.soup;
    if (orderIsEmpty) {
      this.set('showSelectFoodModal', true);
    } else {
      this.deliverOrder();
    }
  },

  cleanController: function () {
    this.set('menu', []);
    this.set('showSoup', false);
    this.set('showDrink', false);
    this.set('showLoadingGreet', false);
    this.set('showAdminSettings', false);
    this.set('hideMenu', true);
    this.set('ordersFilled', null);
    this.set('showLoading', true);
    this.set('showSelectFoodModal', false);
    this.set("noMenuToday", false);
    this.set('orderLastIndex', 0);
  }
});
