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
  addError: false,
  isSaved: false,
  showLoading: false,
  userList: null,
  menuIncomplete: false,
  addSoupError: false,
  addDrinkError: false,

  actions: {
    closeModal: function () {
      this.set("menuIncomplete", false);
    },

    enableOption: function (option, optionId) {
      var isEnabled = Ember.$('#'+optionId).prop( "checked" );
      this.set(option, isEnabled);
    },

    addProtein: function () {
      var proteins = this.menu.proteins;
      if (this.checkIfEmpty(proteins)) {
        this.showAddError()
      } else {
        var id = this.menu.proteins.length - 1;
        proteins.push({name: "", id: id});
        Ember.set(this.menu, "proteins", proteins);
      }
      this.notifyPropertyChange('menu');
    },

    addAccomp: function () {
      var accomps = this.menu.accomps;
      if (this.checkIfEmpty(accomps)) {
        this.showAddError()
      } else {
        var id = this.menu.accomps.length;
        accomps.push({name: "", id: "accomp"+id});
        Ember.set(this.menu, "accomps", accomps);
      }
      this.notifyPropertyChange('menu');
    },

    addAddition: function () {
      var addit = this.menu.additions;
      if (this.checkIfEmpty(addit)) {
        this.showError("addError")
      } else {
        var id = this.menu.additions.length;
        addit.push({name: "", id:  "addition"+id});
        Ember.set(this.menu, "additions", addit);
      }
      this.notifyPropertyChange('menu');
    },

    deleteLastItem: function (prop) {
      if (this.menu[prop].length > 1) {
        this.menu[prop].pop();
      } else {
        this.showError("deleteError");
      }
      this.notifyPropertyChange('menu');
    },
  },

  checkIfEmpty: function (items) {
    for (var i = 0; i < items.length; i++) {
      if(items[i].name == ""){
        return true;
      }
    }
    return false;
  },

  showError: function (error) {
    var that = this;
    this.set(error, true);
    setTimeout(function() {
      that.set(error, false);
    }, 3000);
  },

  showIncompleteMenu: function () {
    if (!this.addSoupError || !this.addDrinkError) {
      this.set("menuIncomplete", true);
    }
  },

  clearController: function () {
    var menu =  {
      proteins: [{name: "", id:"protein0"}],
      accomps: [{name: "", id:"accomp0"}],
      additions: [{name: "", id:"addition0"}],
      drink: null,
      soup: null,
      menuDate: null,
    };
    this.set("menu", menu);
    this.set("addDrink", false);
    this.set("addSoup", false);
    this.set("deleteError", false);
    this.set("addError", false);
    this.set("addSoupError", false);
    this.set("addDrinkError", false);
    this.set("isSaved", false);
    this.set("showLoading", false);
    this.set("menuIncomplete", false);

  }
});
