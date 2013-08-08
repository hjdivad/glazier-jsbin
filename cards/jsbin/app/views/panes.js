var PanesView = Ember.View.extend({
  elementId: 'panes',

  didInsertElement: function () {
    this._super();
    this._resizePanes();
  },

  paneResize: function () {
    if (this.get('state') === 'inDOM') {
      Ember.run.later(this, '_resizePanes', 1);
    }
  }.observes('controller.paneWidth'),

  _resizePanes: function () {
    var paneWidth = this.get('controller.paneWidth');

    this.$('textarea, div').css({ width: paneWidth});
  }
});

export default PanesView;
