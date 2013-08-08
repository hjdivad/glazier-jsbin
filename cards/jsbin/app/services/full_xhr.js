import Conductor from 'conductor';

var FullXhrService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method ajax
      @param ajaxOpts {Object}
    */
    ajax: function(ajaxOpts) {
      // TODO: rejection does not seem to produce useful values
      return Ember.$.ajax(ajaxOpts);
    }
  }
});

export default FullXhrService;
