/*global wait */

import App from "app/application";
import Conductor from "conductor";
import { mockModule, resetModules } from "helpers/module_test_helpers";
import { config as RSVPConfig } from "rsvp/config";

QUnit.config.testTimeout = 2000;
// QUnit.config.testTimeout = 1000 * 60 * 60;

var RSVP = Conductor.Oasis.RSVP,
    Promise = RSVP.Promise,
    mockCard, binLoadedDeferral, applicationController, rsvpAsync;

App.rootElement = '#qunit-fixture';
App.setupForTesting();
App.injectTestHelpers();

if (/phantom/i.test(navigator.userAgent)) { return; }

function asyncEmber() {
  rsvpAsync = RSVPConfig.async;

  RSVP.configure('async', function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    Ember.run(function() {
      fn.call(null, args);
    });
  });
}

function unasyncEmber() {
  RSVP.configure('async', rsvpAsync);
}

module('JSBin Output tests', {
  setup: function() {
    for (var key in define.seen) {
      if (!define.seen.hasOwnProperty(key)) { continue; }
    
      delete define.seen[key];
    }
    asyncEmber();

    binLoadedDeferral = RSVP.defer();
    mockCard = {
      data: {
        html: '',
        css: '',
        js: ''
      },
      whenBinLoaded: binLoadedDeferral.promise,
      dataDidChange: Ember.K,
      createOutputSandbox: Ember.K
    };
    mockModule('card', mockCard);

    // TODO: This seems terrible
    try {
      App.reset();
    } catch (error) {
      // There's some attempt to `node.unchain` on an undefined node when
      // tearing down an observer related to the if blocks in the panes view.
    }

    // There is no way this should be necessary.  There may be a bug in
    // `App.reset`, although it's hard to believe that it doesn't work with
    // elements that have ids, if anybody is acutally using it.
    for (var viewId in Ember.View.views) {
      if (!Ember.View.views.hasOwnProperty(viewId)) { continue; }
    
      delete Ember.View.views[viewId];
    }

    wait().then(function () {
      Ember.run(function () {
        binLoadedDeferral.resolve();
      });

      applicationController = App.__container__.lookup('controller:application');

      Ember.run(function() {
        applicationController.setProperties({
          HTMLVisible: true,
          CSSVisible: true,
          JSVisible: true,
          outputVisible: true
        });
      });
    });
  
    // uncomment for testing
    $('#qunit-fixture').css({ left: 200, top: 600 });
  },

  teardown: function () {
    unasyncEmber();
    resetModules();
  }
});

asyncTest("it updates the output when html is modified", 1, function () {
  mockCard.dataDidChange = function (data) {
    equal(data.html, "<strong>updated html</strong>", "card was notified of data change");
    start();
  };

  wait().visit("/").then(function () {
    Ember.run(function() {
      applicationController.set('html', '<strong>updated html</strong>');
    });
  });
});

asyncTest("it updates the output when css is modified", 1, function () {
  mockCard.dataDidChange = function (data) {
    equal(data.css, "#new-css { }", "card was notified of data change");
    start();
  };

  wait().visit("/").then(function () {
    Ember.run(function() {
      applicationController.set('css', '#new-css { }');
    });
  });
});

asyncTest("it updates the output when js is modified", 1, function () {
  mockCard.dataDidChange = function (data) {
    equal(data.js, "// new js", "card was notified of data change");
    start();
  };

  wait().visit("/").then(function () {
    Ember.run(function() {
      applicationController.set('js', '// new js');
    });
  });
});
