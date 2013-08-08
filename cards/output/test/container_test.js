import Conductor from "conductor";
import { TestService, inCard } from "helpers/card_test_helpers";

QUnit.config.testTimeout = 500;
// Use this for debugging
QUnit.config.testTimeout = 1000 * 60 * 60;

var Oasis = Conductor.Oasis,
    RSVP = Oasis.RSVP,
    CardURL = 'card.js',
    conductor, card, server;


if (/phantom/i.test(navigator.userAgent)) { return; }

module('JSbin Output Card Acceptance Tests', {
  setup: function () {
    conductor = new Conductor({
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    conductor.services.test = TestService;

    // uncomment for testing
    $('#qunit-fixture').css({ left: 200, top: 600 });
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

    // uncomment to log all messages
    // console.log(service, direction, type, data);
  });
  card.appendTo('#qunit-fixture');

  return card.promise;
}

asyncTest("it renders a jsbin", 1, function () {
  conductor.loadData(CardURL, 1, {
    html: '<!DOCTYPE HTML><html><head></head><body>Initial body content</body></html>',
    css: 'body { font-weight: bold; }',
    js: 'document.body.innerHTML = "some js ran"'
  });

  loadCard();
  card.render();

  inCard(card, function (card) {
    var watcher = setInterval(function () {
      if (document.body.innerText === 'some js ran') {
        ok(true, 'output is rendered');
        clearInterval(watcher);
        start();
      }
    }, 200);
  });
});

asyncTest("it rerenders a jsbin", 1, function () {
  conductor.loadData(CardURL, 1, {
    html: '<!DOCTYPE HTML><html><head></head><body>Initial body content</body></html>',
    css: 'body { font-weight: bold; }',
    js: 'document.body.innerHTML = "some js ran"'
  });

  loadCard();
  card.render();

  card.updateData('*', {
    html: '<!DOCTYPE HTML><html><head></head><body>Initial body content</body></html>',
    css: 'body { font-weight: bold; }',
    js: 'document.body.innerHTML = "updated js has run"'
  });

  inCard(card, function (card) {
    var watcher = setInterval(function () {
      if (document.body.innerText === 'updated js has run') {
        ok(true, 'output is rerendered after data updated');
        clearInterval(watcher);
        start();
      }
    }, 200);
  });
});
