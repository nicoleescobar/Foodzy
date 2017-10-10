import Ember from 'ember';

export default Ember.Controller.extend({
  menu: {
    proteins: [{name: "", id:"protein0"}],
    accomps: [{name: "", id:"accomp0"}],
    additions: [{name: "", id:"addition0"}],
    drink: null,
    soup: null,
    menuDate: null,
  },
  addDrink: false,
  addSoup: false,
  deleteError: false,
  isSaved: false,

  actions: {
    enableOption: function (option, optionId) {
      var isEnabled = Ember.$('#'+optionId).prop( "checked" );
      this.set(option, isEnabled);
    },

    addProtein: function () {
      var proteins = this.menu.proteins;
      var id = this.menu.proteins.length - 1;
      proteins.push({name: "", id: id});
      Ember.set(this.menu, "proteins", proteins);
      this.notifyPropertyChange('menu');
    },

    addAccomp: function () {
      var accomps = this.menu.accomps;
      var id = this.menu.accomps.length;
      accomps.push({name: "", id: "accomp"+id});
      Ember.set(this.menu, "accomps", accomps);
      this.notifyPropertyChange('menu');
    },

    addAddition: function () {
      var addit = this.menu.additions;
      var id = this.menu.additions.length;
      addit.push({name: "", id:  "addition"+id});
      Ember.set(this.menu, "additions", addit);
      this.notifyPropertyChange('menu');
    },

    deleteLastItem: function (prop) {
      if (this.menu[prop].length > 1) {
        this.menu[prop].pop();
      } else {
        this.showDeleteError();
      }
      this.notifyPropertyChange('menu');
    },


  },

  showDeleteError: function () {
    var that = this;
    this.set("deleteError", true);
    setTimeout(function() {
      that.set("deleteError", false);
    }, 3000);
  }
});
