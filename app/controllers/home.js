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

  actions: {
    saveOrder: function () {
      Ember.set(this.order, "drink", Ember.$("#drinkCheck").prop( "checked" ));
      Ember.set(this.order, "soup", Ember.$("#soupCheck").prop( "checked" ));
      console.log("order", this.order, this.user);
      this.openUsers();
    },

    selectProtein: function(protein) {
      Ember.set(this.order, "protein", protein)
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
      Ember.set(this.order, "addition", addition)
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

  openUsers: function () {

  }
});
