import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('new-lunch',{path: '/new'});
  this.route('login',{path: '/login'});
});

export default Router;
