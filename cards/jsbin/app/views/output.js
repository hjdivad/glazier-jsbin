import card from 'card';

var OutputView = Ember.View.extend({
  elementId: 'output',
  isVisibleBinding: 'controller.outputVisible',

  didInsertElement: function () {
    this._super();
    card.createOutputSandbox(this.$()[0]);
  }
});

export default OutputView;
