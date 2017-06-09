import Ember from 'ember';

export default Ember.Controller.extend({
  user: {email: null, password: null},
  errorAuth: false,

  showErrorAuth: function () {
    var that = this;
    this.set("errorAuth", true);
    setTimeout(function() {
      that.set("errorAuth", false);
    }, 3000)
  }
});
