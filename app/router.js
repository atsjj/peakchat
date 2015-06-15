import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('logout');

  this.resource('chat', function() {
  });

  this.route('call');
});

export default Router;
