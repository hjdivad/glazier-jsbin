var PanesController = Ember.ObjectController.extend({
  needs: ['application'],
  contentBinding: 'controllers.application',

  paneWidth: function () {
    var visiblePanels = ['HTMLVisible', 'CSSVisible', 'JSVisible', 'outputVisible'].map( function (property) {
      return this.get(property);
    }, this).filter(function (value) {
      return value;
    }).length;

    return (100 / (visiblePanels || 1)) + '%';
  }.property('HTMLVisible', 'CSSVisible', 'JSVisible', 'outputVisible')
});

export default PanesController;
