import Conductor from 'conductor';

var MockXHRSerivce = Conductor.Oasis.Service.extend({
  requests: {
    get: function (url) {
      // TODO: return fixture data
    }
  }
});

export default MockXHRSerivce;
