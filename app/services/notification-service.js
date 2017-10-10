import Ember from 'ember';

export default Ember.Service.extend({
  sendSingleNotification: function(data, success, error){
    Ember.$.ajax({
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          'Authorization': 'key=AAAATErsoLc:APA91bFNtwS9a_bwtkPuYBoTHav-sUvPJwtxa0so-qaqPHToIiPMFsxuuXVUu5sTa5MOBLphXFU3KsJg4hbpoC8M8E1qvN81y9-HZAbdfaOc_mP8X5A9oBtLIVc8Z3f72AoC9-N4B_lk',

      },
      type: 'POST',
      dataType: "json",
      url: 'https://fcm.googleapis.com/fcm/send',
      data: data,
      success: success,
      error: error
    });
  },
});
