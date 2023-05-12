/**
 * Parse querystring
 *
 * @example
 *   
 *   qs({ a: 1, b: '2', c: false, d: 'Hello world' })
 *   // a=1&b=2&c=false&d=Hello%20world
 *   
 *   qs.parse('greeting=hello%20world&count=5') 
 *   // { greeting: 'hello world', count: 5 }
 */

var qs = function(obj) {
  return Object.keys(obj).map(function(key) {
    return [ 
      encodeURIComponent(key), 
      encodeURIComponent(obj[key])
    ].join('=');
  }).join('&');
};

qs.parse = function parse(qs) {
  var query = {};
  if (qs && qs.length) {
    qs.split('&').forEach(function(part) {
      var pair = part.split('=');
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);
      if (!isNaN(value)) {
        value = Number(value);
      }
      query[key] = value;
    });
  }
  return query;
}

exports = module.exports = qs;