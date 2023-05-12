var assert  = require('assert');
var qs      = require('./');

suite('html');

test('should encode object to querystring', function() {    
  var str = qs({ a: 'b', c: 1});
  assert.equal(str, 'a=b&c=1');
});

test('should decode querystring to object', function() {    
  var obj = qs.parse('a=b&c=1');
  assert.deepEqual(obj, { a: 'b', c: 1});
});