import Conductor from 'conductor';

function wait() {
  var promise, obj = {}, helperName,
      card = requireModule('card');

  return new Conductor.Oasis.RSVP.Promise(function(resolve) {
    var watcher = setInterval(function() {
      var routerIsLoading = card.App.__container__.lookup('router:main').router.isLoading;
      if (routerIsLoading) { return; }
      if (Ember.run.hasScheduledTimers() || Ember.run.currentRunLoop) { return; }
      clearInterval(watcher);
      Ember.run(function() {
        resolve();
      });
    }, 10);
  });
}

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(testData) {
      var testFn = new Function(wait.toString() + '\nreturn ' + testData.fnString)();
      var card = this.card;

      // TODO: shouldn't have to do this, but see
      // https://github.com/tildeio/conductor.js/issues/60
      return card.promise.then(function () {
        return testFn.call(window, card);
      });
    }
  }
});

export default TestConsumer;
