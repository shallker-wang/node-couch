node-couch
==========

CouchDB API in Nodejs.

## Installation
```shell
npm install git://github.com/shallker-wang/node-couch.git
```

## Quick Start
Require and create an instance with your CouchDB URL:
```javascript
var Couch = require('node-couch');
var db = 'http://my-site.com/couch/db/';
var couch = new Couch(db);
```

Start to make the API calls:
```javascript
var data = {foo: "bar"};
couch.addDocument(data, function(result, response) {
  if (response.statusCode === 201) console.log('Doc added!');
});
```

## APIs
Add a document:
```javascript
couch.addDocument(doc, function(result, response) {});
```

Check if has a document:
```javascript
couch.hasDocument(id, function(result, response) {});
```

Get a document:
```javascript
couch.getDocument(id, function(result, response) {});
```

Update a document:
```javascript
couch.updateDocument(id, rev, doc, function(result, response) {});
```

Delete a document:
```javascript
couch.deleteDocument(id, rev, function(result, response) {});
```

## Todo
* write a test
