import Ember from 'ember';

export default Ember.Controller.extend({
  menu: [],
  order: {
    protein: null,
    accomps: [],
    additions: [],
    soup: false,
    drink: false
  }
});
