/*global wait,sinon */

import Conductor from "conductor";
import FullXhrService from "app/services/full_xhr";
import { TestService, inCard } from "helpers/card_test_helpers";

QUnit.config.testTimeout = 500;
// Use this for debugging
// QUnit.config.testTimeout = 1000 * 60 * 60;

var Oasis = Conductor.Oasis,
    RSVP = Oasis.RSVP,
    CardURL = 'cards/glazier-jsbin/card.js',
    conductor, card, server;


if (/phantom/i.test(navigator.userAgent)) { return; }

module('JSbin Card Acceptance Tests', {
  setup: function () {
    server = sinon.fakeServer.create();

    server.autoRespond = true;
    sinon.FakeXMLHttpRequest.useFilters = true;
    sinon.FakeXMLHttpRequest.addFilter(function (method, url, async, username, password) {
      if (/jsbin.com/.test(url)) {
        // only stubbing jsbin.com
        return false;
      }

      return true;
    });

    conductor = new Conductor({
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    conductor.services.fullXhr = FullXhrService;
    conductor.services.test = TestService;
  },

  teardown: function () {
    var ignoredRequests = server.requests.filterProperty('readyState', 1);

    ignoredRequests.forEach(function (request) {
      ok(false, request.url + " was ignored: update filter or add a `respondWith` to your test");
    });

    server.restore();
  }
});

function loadCard() {
  card = conductor.load(CardURL, 1, {
    capabilities: ['repository', 'fullXhr', 'test']});
  card.promise.then(null, Conductor.error);

  card.wiretap( function (service, event) {
    var data = event.data,
        direction = event.direction === 'sent' ? '→' : '←',
        type = event.type;

    // uncomment for testing
    // console.log(service, direction, type, data);
  });
  card.appendTo('#qunit-fixture');

  return card.promise;
}

function respondWithJSON(url, json) {
  var serialized = JSON.stringify(json);

  server.respondWith(url, [
    200, { "Content-Type": "application/json", "Content-Length": serialized.length }, serialized
  ]);
}


asyncTest("it can load the content for a jsbin from a jsbin id", 3, function () {
  respondWithJSON('http://jsbin.com/api/ucanam/239', {
    html: "some html",
    css: "some css",
    javascript: "// some javascript"
  });
  
  conductor.loadData(CardURL, 1, { id: 'ucanam/239' });
  loadCard();

  inCard(card, function (card) {
    card.whenBinLoaded.then(function () {
      equal(card.data.html, "some html", "html was loaded correctly from jsbin");
      equal(card.data.css, "some css", "css was loaded correctly from jsbin");
      equal(card.data.js, "// some javascript", "javascript was loaded correctly from jsbin");

      start();
    });
  });
});

asyncTest("it can load new content for a jsbin when the id changes", 4, function () {
  respondWithJSON('http://jsbin.com/api/ucanam/239', {
    html: "html1",
    css: "css1",
    javascript: "// js1"
  });
  respondWithJSON('http://jsbin.com/api/anuzaid/111', {
    html: "html2",
    css: "css2",
    javascript: "// js2"
  });

  conductor.services.test.prototype.events = conductor.services.test.prototype.events || {}; 
  conductor.services.test.prototype.events.updateData = function () {
    ok(true, "Card data loaded: updating id");
    card.updateData('*', { id: 'anuzaid/111' });
  };
  
  conductor.loadData(CardURL, 1, { id: 'ucanam/239' });
  loadCard();

  inCard(card, function (card) {
    console.log("incard?");
    card.whenBinLoaded.then(function () {
      card.consumers.test.send('updateData');

      card.whenBinLoaded.then(function () {
        equal(card.data.html, "html2", "html was loaded correctly from jsbin");
        equal(card.data.css, "css2", "css was loaded correctly from jsbin");
        equal(card.data.js, "// js2", "javascript was loaded correctly from jsbin");

        start();
      });
    });
  });
});

function setupRenderTest() {
  respondWithJSON('http://jsbin.com/api/ucanam/239', {
    html: "<!DOCTYPE html><html><body>Hello HTML</body></html>",
    css: '#an-id { }',
    javascript: '// some js'
  });
  
  conductor.loadData(CardURL, 1, { id: 'ucanam/239' });
  loadCard();
  $(card.sandbox).css({ maxWidth: 500, maxHeight: 500 });

  // uncomment for testing
  $('#qunit-fixture').css({ left: 200, top: 600 });
}

asyncTest("it can render an html tab", 5, function () {
  setupRenderTest();
  card.render(['html']);

  inCard(card, function (card) {
    card.App.then(function () {
      wait().then(function () {
        equal($('#html').length, 1, "html panel is visible");
        equal($('#css').length, 0, "css panel is not visible");
        equal($('#js').length, 0, "javascript panel is not visible");
        equal($('#output:visible').length, 0, "output panel is not visible");

        equal($('#html').val(), '<!DOCTYPE html><html><body>Hello HTML</body></html>', "content is correct");
        start();
      });
    });
  });
});

asyncTest("it can render a css tab", 5, function () {
  setupRenderTest();
  card.render(['css']);

  inCard(card, function (card) {
    card.App.then(function () {
      wait().then(function () {
        equal($('#html').length, 0, "html panel is not visible");
        equal($('#css').length, 1, "css panel is visible");
        equal($('#js').length, 0, "javascript panel is not visible");
        equal($('#output:visible').length, 0, "output panel is not visible");

        equal($('#css').val(), '#an-id { }', "content is correct");
        start();
      });
    });
  });
});

asyncTest("it can render a javascript tab", 5, function () {
  setupRenderTest();
  card.render(['js']);

  inCard(card, function (card) {
    card.App.then(function () {
      wait().then(function () {
        equal($('#html').length, 0, "html panel is not visible");
        equal($('#css').length, 0, "css panel is not visible");
        equal($('#js').length, 1, "javascript panel is visible");
        equal($('#output:visible').length, 0, "output panel is not visible");

        equal($('#js').val(), '// some js', "content is correct");
        start();
      });
    });
  });
});

asyncTest("it can render an output tab", 6, function () {
  setupRenderTest();
  card.render(['output']);

  inCard(card, function (card) {
    card.App.then(function () {
      wait().then(function () {
        equal($('#html').length, 0, "html panel is not visible");
        equal($('#css').length, 0, "css panel is not visible");
        equal($('#js').length, 0, "javascript panel is not visible");
        equal($('#output:visible').length, 1, "output panel is visible");

        // output tab should be the right size
        equal($('#output iframe').width(), 500, "output panel is rendered with correct width");
        equal($('#output iframe').height(), 500, "output panel is rendered with correct height");

        start();
      });
    });
  });
});

asyncTest("it can render multiple tabs", 4, function () {
  setupRenderTest();
  card.render(['html', 'js']);

  inCard(card, function (card) {
    card.App.then(function () {
      wait().then(function () {
        equal($('#html').length, 1, "html panel is visible");
        equal($('#css').length, 0, "css panel is not visible");
        equal($('#js').length, 1, "javascript panel is visible");
        equal($('#output:visible').length, 0, "output panel is visible");

        start();
      });
    });
  });
});

