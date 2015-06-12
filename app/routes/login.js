import Ember from 'ember';

export default Ember.Route.extend({
  peering: Ember.inject.service('peering'),

  model() {
    return this.store.createRecord('user');
  },

  actions: {
    loginToChat() {
      var model = this.modelFor('login');

      this.get('session').open('echo', model)
        .then(() => {
          this.set('peering.identity', model.get('name'));
          return model.save();
        })
        .then(() => {
          this.transitionTo('index');
        });
    },

    willTransition() {
      var model = this.modelFor('login');

      if (model.get('isNew')) {
        model.deleteRecord();
      }
    }
  }
});
