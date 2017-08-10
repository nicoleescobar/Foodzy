import Ember from 'ember';

export default Ember.Component.extend({
  isAdminUser: false,
  user: null,

  didReceiveAttrs: function () {
    this.checkAdminUsers();
  },

  actions: {
    logOut: function () {
      var that = this;
      firebase.auth().signOut().then(function() {
        that.get('router').transitionTo('home');
      }, function(error) {
        console.log("Error", error);
      });
    }
  },

  checkAdminUsers: function () {
    var admins;
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         that.set('user', user.providerData[0]);
      }
    });
    firebase.database().ref('/adminsUsers').once('value').then(function(snapshot) {
      admins = snapshot.val();
      for (var i = 0; i < admins.length; i++) {
        if(admins[i].email === that.user.email){
          that.set('isAdminUser', true);
        }
      }
    });
  },
});
