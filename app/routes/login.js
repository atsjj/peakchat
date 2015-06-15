import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend({
  peering: Ember.inject.service('peering'),

  model() {
    return this.store.createRecord('user');
  },

  actions: {
    loginToChat() {
      var model = this.modelFor('login');
      this.get('session').authenticate('authenticator:application', { name: model.get('name') })
        .then(() => {
          return model.save();
        })
        .then(() => {
          this.set('peering.identity', model.get('name'));
        })
    },

    willTransition() {
      var model = this.modelFor('login');

      if (model.get('isNew')) {
        model.deleteRecord();
      }
    }
  }
});
