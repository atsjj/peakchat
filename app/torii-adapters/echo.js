import Adapter from 'torii/adapters/application';
import Ember from 'ember';

export default Adapter.extend({
  open: function(authorization) {
    return Ember.RSVP.Promise.resolve({
      currentUser: authorization.get('name')
    });
  },

  close: function() {
    return Ember.RSVP.Promise.resolve();
  }
});
