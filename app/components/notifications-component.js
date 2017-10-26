import Ember from 'ember';

export default Ember.Component.extend({
  showNotification: false,
  notification: null,

  didReceiveAttrs: function () {
    var that = this;
    Ember.$( document ).ready(function() {
      messaging.onMessage(function(payload) {
        that.setNotification(payload)
      });
    });
  },

  actions: {
    hide: function () {
      this.set("showNotification", false);
    }
  },

  setNotification: function (payload) {
    var that = this;
    console.log("payload", payload);
    this.set("notification", payload.notification);
    this.set("showNotification", true);

    setTimeout(function () {
      that.set("notification", null);
      that.set("showNotification", false);
    }, 5000);
  }
});
