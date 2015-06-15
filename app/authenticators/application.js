import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    return Ember.RSVP.resolve();
  },

  authenticate(options) {
    return Ember.RSVP.resolve();
  },

  invalidate(data) {
    return Ember.RSVP.resolve();
  }
});
