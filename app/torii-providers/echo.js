import Ember from 'ember';

export default Ember.Object.extend({
  open: function(authorization) {
    return Ember.RSVP.Promise.resolve(authorization);
  }
});
