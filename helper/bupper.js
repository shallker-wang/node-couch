/* @author shallker.wang@profero.com */

/* a buffer helper */
var Bupper = (function() {
  function constructor() {
    this.chunks = [];
    this.size = 0;
  }

  constructor.prototype = (function() {

    this.add = function(chunk) {
      this.chunks.push(chunk);
      this.size += chunk.length;
    }

    this.combine = function() {
      var buff;
      switch (this.chunks.length) {
        case 0:
          buff = new Buffer(0);
        break;
        case 1:
          buff = this.chunks[0];
        break;
        default:
          buff = new Buffer(this.size);
          for (var i = 0, pos = 0, l = this.chunks.length; i < l; i++) {
            var chunk = this.chunks[i];
            chunk.copy(buff, pos);
            pos += chunk.length;
          }
        break;
      }
      this.clean();
      return buff;
    }

    this.clean = function() {
      this.chunks = [];
      this.size = 0;
    }

    return this;
  }).call({});

  return constructor;
})();

module.exports = new Bupper();
