import Adapter from 'torii/adapters/application';
import Ember from 'ember';

export default Adapter.extend({
  open: function(authorization) {
    return Ember.RSVP.Promise.resolve(authorization);
  }
});
