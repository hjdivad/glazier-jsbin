import Conductor from "conductor";
//import MockXHRService from "app/services/mock_xhr_service";
import { TestService, inCard } from "helpers/card_test_helpers";

var Oasis = Conductor.Oasis,
    RSVP = Oasis.RSVP,
    CardURL = '/cards/glazier-jsbin/card.js',
    conductor, card;


if (/phantom/i.test(navigator.userAgent)) { return; }

module('JSbin Acceptance Tests', {
  setup: function () {
    conductor = new Conductor({
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    //conductor.service.xhr = MockXHRService;
    conductor.services.test = TestService;

    /*
    MockXHRService.Fixtures = {
      // TODO: fixtures
    };
    */
  }
});

function loadCard() {
  card = conductor.load(CardURL, 1, { capabilities: ['repository', 'test']});
  card.promise.then(null, Conductor.error);
  card.appendTo('#qunit-fixture');
}

asyncTest("it can load the content for a jsbin from a jsbin id", 1, function () {
  conductor.loadData(CardURL, 1, { id: 'ucanaam/239' });
  loadCard();

  console.log("ohai1");
  inCard(card, function (card) {
    debugger;
  });
});
