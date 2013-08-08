import Conductor from 'conductor';
import RSVP from 'rsvp';
import TestConsumer from 'app/consumers/test';


var card = Conductor.card({
  consumers: {
    'test': TestConsumer
  },

  activate: function () {
    this.consumers.height.autoUpdate = false;
  },

  rendered: false,
  render: function (intent, dimensions) {
    var doc = window.document,
        docElement = doc.documentElement,
        headElement,
        bodyElement,
        styleElement,
        jsElement;

    docElement.innerHTML = this.data.html;
    headElement = doc.head || docElement.getElementsByTagName('head')[0];
    bodyElement = doc.body;

    styleElement = doc.createElement('style');
    styleElement.innerHTML = styleElement.innerText = this.data.css;
    headElement.appendChild(styleElement);

    jsElement = doc.createElement('script');
    jsElement.text = jsElement.textContent = this.data.js;
    headElement.appendChild(jsElement);

    this.rendered = true;
  },

  didUpdateData: function (bucket, data) {
    if (this.rendered) {
      this.render();
    }
  }
});

export default card;

