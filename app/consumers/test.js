import Conductor from 'conductor';

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(testData) {
      var testFn = new Function('return ' + testData.fnString)();
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
