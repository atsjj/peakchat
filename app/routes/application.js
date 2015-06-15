import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(ApplicationRouteMixin, {
  peering: Ember.inject.service('peering'),

  actions: {
    sessionAuthenticationFailed(error) {
      this.transitionTo('login');
    },

    sessionAuthenticationSucceeded() {
      this.transitionTo('chat');
    }
  }
});
