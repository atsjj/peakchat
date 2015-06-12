import Provider from 'torii/providers/base';
import Ember from 'ember';

export default Provider.extend({
  name: 'echo',

  open: function(authorization) {
    return Ember.RSVP.Promise.resolve(authorization);
  }
});
