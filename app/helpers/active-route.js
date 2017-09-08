import Ember from 'ember';

export function activeRoute(params) {
  return params[0] == params [1] ? 'active' : '';
}

export default Ember.Helper.helper(activeRoute);
