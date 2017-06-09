import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    autenticate: function () {
      var that = this;
      var controller = this.controllerFor("login");
      var email = controller.user.email;
      var pass = controller.user.password;

      firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(function (result) {
        that.transitionTo('new-lunch');
      })
      .catch(function(error) {
         controller.showErrorAuth();
      });
    }
  },
});
