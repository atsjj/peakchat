import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.store.find('user')
      .then(function(users) {
        return users.invoke('destroyRecord');
      })
      .then(() => {
        this.transitionTo('index');
      });
  }
});
