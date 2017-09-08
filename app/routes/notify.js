import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    this.getUsers();
  },

  getUsers: function () {
    var controller = this.controllerFor("notify");

    firebase.database().ref('users').once('value', function(snapshot) {
      var users = snapshot.val();
      if (Ember.isPresent(users)) {
        controller.set('users', users.users)
      } else {
        controller.set('users', []);
      }
    });
  },


});
