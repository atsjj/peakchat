import Ember from 'ember';

var get = Ember.get;
// var set = Ember.set;

export default Ember.Route.extend({
  peering: Ember.inject.service('peering'),

  initPeering: Ember.on('init', function() {
    get(this, 'peering');
  }),

  model() {
    return get(this, 'peering.annoucements');
  }
});
