import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['controls', 'muted', 'src'],
  tagName: 'video',

  controls: true,
  muted: true
});
