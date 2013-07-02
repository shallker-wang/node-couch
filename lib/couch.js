var MyHttp = require('my-http');

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
      var http = new MyHttp();
      http.set('url', this.db);
      http.set('method', 'POST');
      http.set('data', doc);
      http.setHeader('Content-Type', 'application/json;charset=utf-8');
      http.setHeader('Content-Length', doc.length);
      http.on('error', error);
      http.request(onComplete.bind(this));

      function onComplete(data, res) {
        this.log('addDocument', data);
        onAdd(data, res);
      }
    }

    this.hasDocument = function(id, onHas) {
      var http = new MyHttp();
      http.set('url', this.db + id);
      http.set('method', 'GET');
      http.setHeader('Content-Type', 'application/json; charset=UTF-8');
      http.setHeader('Accept', 'application/json');
      http.on('response', onResponse.bind(this));
      http.request();

      function onResponse(code, res) {
        this.log('hasDocument', code);
        if (res.statusCode === 200) onHas(true, res);
        else onHas(false, res);
      }
    }

    this.getDocument = function(id, onGet) {
      var http = new MyHttp();
      http.set('url', this.db + id);
      http.set('method', 'GET');
      http.setHeader('Content-Type', 'application/json');
      http.setHeader('Accept', 'application/json');
      http.request(onComplete.bind(this));

      function onComplete(data, res) {
        this.log('getDocument', data);
        if (res.statusCode === 200) onGet(JSON.parse(data), res);
        else onGet(false, res);
      }
    }

    this.updateDocument = function(id, rev, doc, onUpdate) {
      if (typeof doc === 'object') doc = toJSON(doc);
      doc = toBuffer(doc);
      var http = new MyHttp();
      http.set('url', this.db + id);
      http.set('method', 'PUT');
      http.set('data', doc);
      http.setHeader('Content-Type', 'application/json');
      http.setHeader('Content-Length', doc.length);
      http.setHeader('If-Match', rev);
      http.on('response', onResponse.bind(this));
      http.request();

      function onResponse(code, res) {
        this.log('updateDocument', code);
        if (code === 201) onUpdate(true, res);
        else onUpdate(false, res);
      }
    }

    this.deleteDocument = function(id, rev, onDelete) {}

    this.getAttachment = function(docName, attName, onGet) {}

    this.addAttachment = function(docName, docRev, attName, att, attType, onAdd) {
      att = toBuffer(att);
      var http = new MyHttp();
      http.set('url', this.db + docName + '/' + attName);
      http.set('method', 'PUT');
      http.setHeader('If-Match', docRev);
      http.set('data', att);
      http.setHeader('Content-Type', attType);
      http.setHeader('Content-Length', att.length);
      http.request(onComplete.bind(this));

      function onComplete(data, res) {
        this.log('addAttachment', data);
        onAdd(data, res);
      }
    }

    /* 200 / 409 */
    this.deleteAttachment = function(docName, docRev, attName) {

    }

    this.log = function() {
      if (this.debug) {
        var args;
        args = [].slice.call(arguments);
        args.unshift('Couch');
        console.log.apply(console, args);
      }
    }

    return this;
  }).call({});

  return constructor;
})();

module.exports = Couch;
