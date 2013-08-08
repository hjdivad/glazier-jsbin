import card from "card";

var ApplicationController = Ember.ObjectController.extend({
  HTMLVisible: false,
  CSSVisible: false,
  JSVisible: false,
  outputVisible: false,

  jsbinObserver: function () {
    Ember.run.debounce(this, '_updateCardData', 100);
  }.observes('html', 'css', 'js'),

  _updateCardData: function () {
    var html = this.get('html'),
        css = this.get('css'),
        js = this.get('js');

    card.dataDidChange({
      html: html,
      css: css,
      js: js
    });
  }
});

export default ApplicationController;
