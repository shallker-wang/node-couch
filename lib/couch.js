var MYHTTP = require('../helper/my-http');

var Couch = (function() {

  function toJSON(obj) {
    return JSON.stringify(obj);
  }

  function toBuffer(str) {
    return new Buffer(str);
  }

  function error(msg) {
    throw msg;
    return false;
  }

  function constructor(db) {
    this.db = db;
  }

  constructor.prototype = (function() {

    this.addDocument = function(doc, onAdd) {
      if (typeof doc === 'object') doc = JSON.stringify(doc);
      doc = toBuffer(doc);
      var http = new MYHTTP();
      http.set('url', this.db);
      http.set('method', 'POST');
      http.set('data', doc);
      http.setHeader('Content-Type', 'application/json;charset=utf-8');
      http.setHeader('Content-Length', doc.length);
      http.on('error', error);
      http.request(onComplete.bind(this));

      function onComplete(data, res) {
        onAdd(data, res);
      }
    }

    this.hasDocument = function(id, onHas) {
      var http = new MYHTTP();
      http.set('url', this.db + id);
      http.set('method', 'GET');
      http.setHeader('Content-Type', 'application/json; charset=UTF-8');
      http.setHeader('Accept', 'application/json');
      http.on('response', onResponse);
      http.request();

      function onResponse(code, res) {
        if (res.statusCode === 200) onHas(true, res);
        else onHas(false, res);
      }
    }

    this.getDocument = function(id, onGet) {
      var http = new MYHTTP();
      http.set('url', this.db + id);
      http.set('method', 'GET');
      http.setHeader('Content-Type', 'application/json');
      http.setHeader('Accept', 'application/json');
      http.request(onGet);
    }

    this.updateDocument = function(id, rev, doc, onUpdate) {
      if (typeof doc === 'object') doc = toJSON(doc);
      doc = toBuffer(doc);
      var http = new MYHTTP();
      http.set('url', this.db + id);
      http.set('method', 'PUT');
      http.set('data', doc);
      http.setHeader('Content-Type', 'application/json');
      http.setHeader('Content-Length', doc.length);
      http.setHeader('If-Match', rev);
      http.on('response', onResponse);
      http.request();

      function onResponse(code, res) {
        if (code === 201) onUpdate(true, res);
        else onUpdate(false, res);
      }
    }

    this.deleteDocument = function(id, rev, onDelete) {}

    return this;
  }).call({});

  return constructor;
})();

module.exports = Couch;
