import Ember from 'ember';

export default Ember.Route.extend({
  peering: Ember.inject.service('peering'),

  model() {
    return this.get('peering.annoucements');
  }
});
