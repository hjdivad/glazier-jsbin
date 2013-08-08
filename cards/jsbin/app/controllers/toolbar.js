var ToolbarController = Ember.ObjectController.extend({
  needs: ['application'],

  contentBinding: 'controllers.application',

  toggleHTML: function () { this.toggleProperty('HTMLVisible'); },
  toggleCSS: function () { this.toggleProperty('CSSVisible'); },
  toggleJS: function () { this.toggleProperty('JSVisible'); },
  toggleOutput: function () { this.toggleProperty('outputVisible'); }
});

export default ToolbarController;
