import card from 'card';
import Conductor from 'conductor';
import JSBin from 'app/models/jsbin';

var ApplicationRoute = Ember.Route.extend({
  model: function () {
    return card.whenBinLoaded.then(function () {
      return JSBin.create({
        html: card.data.html,
        css: card.data.css,
        js: card.data.js
      });
    });
  }
});

export default ApplicationRoute;
