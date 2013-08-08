import Conductor from 'conductor';
import RSVP from 'rsvp';
import TestConsumer from 'app/consumers/test';

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');

Conductor.requireCSS('/css/glazier_card.css');
Conductor.requireCSS('card.css');

// TODO: requires conductor upgrade
// Conductor.configure('eventHandler', Ember.run);


var OutputCardURL = '/cards/glazier-jsbin-output/card.js';

var card = Conductor.card({
  consumers: {
    'fullXhr': Conductor.Oasis.Consumer,
    'repository': Conductor.Oasis.Consumer,
    'test': TestConsumer
  },

  defaultContentDiv: "<div id=\"card\"></div>",

  activate: function(initialData) {
    this._deferBinLoading();

    this.assistantConductor = new Conductor();
    this.outputCardDeferral = RSVP.defer();
    this.whenOutputCardLoaded = this.outputCardDeferral.promise;

    this.App = requireModule('app/application');
    this.loadBin(initialData.id);
  },

  initializeDOM: function () {
    document.body.innerHTML = this.defaultContentDiv;
    // uncomment for testing
    // this.App.LOG_TRANSITIONS = this.App.LOG_TRANSITIONS_INTERNAL = true;
    Ember.run(this.App, 'advanceReadiness');
    Ember.run(function () {
      card.applicationController = card.App.__container__.lookup('controller:application');
    });
  },

  render: function (intent, dimensions) {
    this._renderPaneVisibility(intent);
  },

  /**
    Hook invoked by conductor to indicate data has changed from the environment.
  */
  didUpdateData: function (bucket, data) {
    this.loadBin(data.id);
  },

  /**
    Hook invoked by the ember app to indicate the data has changed client side.
  */
  dataDidChange: function (data) {
    this._updateData(data.html, data.css, data.js);
  },

  loadBin: function (binId) {
    var card = this,
        url = 'http://jsbin.com/api/' + binId;

    this.consumers.fullXhr.request('ajax', {
      url: url,
      accept: {
        json: 'application/json'
      }
    }).then(function (response) {
      card._updateData(response.html, response.css, response.javascript);
      card._deferBinLoading();
    }, function (error) {
      console.assert(false, "TODO: error handling", error);
    });
  },

  createOutputSandbox: function (parentElement) {
    this.outputCard = this.assistantConductor.load(OutputCardURL, 1);
    this.outputCard.appendTo(parentElement);
    this.outputCardDeferral.resolve();
  },

  _updateData: function (html, css, js) {
    this.data.html = html;
    this.data.css = css;
    this.data.js = js;

    this.assistantConductor.loadData(OutputCardURL, 1, {
      html: html,
      css: css,
      js: js
    });
  },

  _deferBinLoading: function () {
    var completedDeferral = this.binLoadDeferral;
    this.binLoadDeferral = RSVP.defer();
    this.whenBinLoaded = card.binLoadDeferral.promise;

    if (completedDeferral) {
      completedDeferral.resolve();
    }
  },

  panelProperties: {
    html:   'HTMLVisible',
    css:    'CSSVisible',
    js:     'JSVisible',
    output: 'outputVisible'
  },

  _renderPaneVisibility: function (intent) {
    var applicationController = this.applicationController,
        panelVisibilityProperty;

    if (!intent) {
      intent = ['html', 'js', 'output'];
    }

    for (var prop in this.panelProperties) {
      if ( ! this.panelProperties.hasOwnProperty(prop)) { continue; }
    
      panelVisibilityProperty = card.panelProperties[prop];
      applicationController.set(panelVisibilityProperty, false);
    }

    intent.forEach(function (panel) {
      panelVisibilityProperty = card.panelProperties[panel];
      if (panelVisibilityProperty) {
        applicationController.set(panelVisibilityProperty, true);
      }

      if (panel === 'output') {
        card.whenOutputCardLoaded.then(function () {
          var $sandbox = $(card.outputCard.sandbox.el),
              $parent = $sandbox.parent(),
              dims = { width: $parent.width(), height: $parent.height() };

          card.outputCard.render(null, dims);
          $sandbox.css(dims);
        });
      }
    });
  }
});

export default card;

