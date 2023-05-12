/**
 * Connect middleware-inspired router for node and browser
 */


/**
 * Module dependencies
 */

var pathRegex     = require('path-to-regexp');
var qs            = require('seed-qs');
var Queue         = require('seed-queue');


/**
 * Constructor
 */

function Router() {
  if (!(this instanceof Router)) {
    return new Router();
  }
  
  this.routes = [];  
}


/**
 * Add a route to catch
 *
 * @param {String} uri
 * @param {Function} fn(ctx)
 * @return {Router} self
 */

Router.prototype.add =
Router.prototype.get = function(uri, fn) {
  
  var args = Array.prototype.slice.call(arguments);
  
  var uri;
  if (typeof args[0] === 'string') {
    uri = args.shift();
  } else {
    uri = '/';
  }
  
  args.forEach(function(fn) {
    if (fn instanceof Router) {
      var keys = [];
      this.routes.push({
        uri: uri,
        exp: pathRegex(uri, keys),
        keys: keys,
        callback: function(ctx) {
          var errorFn = ctx.error.bind(ctx);
          var resultFn = ctx.result.bind(ctx);
          var nextFn = ctx.next.bind(ctx);
          fn.set({ 
            hash: '/', 
            query: ctx.query,
            context: ctx
          }, function(error, result) {
            if (error) return errorFn(error);
            if (result) return resultFn(result);
            nextFn();
          });
        }
      });
    
      if (uri === '/') uri = '';
      var longUri = uri + '/:__layer*';
      keys = [];
      this.routes.push({
        uri: longUri,
        exp: pathRegex(longUri, keys),
        keys: keys,
        callback: function(ctx) {
          var layer = ctx.params.__layer;
          if (layer) {
            layer = '/' + layer; 
          } else {
            layer = '/';
          }
          var errorFn = ctx.error.bind(ctx);
          var resultFn = ctx.result.bind(ctx);
          var nextFn = ctx.next.bind(ctx);
          fn.set({ 
            hash: layer, 
            query: ctx.query,
            context: ctx
          }, function(error, result) {
            if (error) return errorFn(error);
            if (result) return resultFn(result);
            nextFn();
          });
        }
      });
    } else {
      var keys = [];
      
      if (fn.length === 2) { // middleware
        if (uri === '/') uri = '';
        var longUri = uri + '/:__layer*';
        this.routes.push({
          uri: longUri,
          exp: pathRegex(longUri, keys),
          keys: keys,
          callback: fn
        });
      } else { // handler
        this.routes.push({
          uri: uri,
          exp: pathRegex(uri, keys),
          keys: keys,
          callback: fn
        });
      }
    }
  }.bind(this));
  return this;
}


/**
 * Set route
 *
 * @param {String} uri
 * @param {Function} cb(error, result)
 */

Router.prototype.set = function(uri, cb) {
  
  var hash, query, context;
  
  cb = cb || function(){};
  
  if (typeof uri === 'string') {
    var parts = uri.split('?');
    hash = parts.shift();
    query = qs.parse(parts.join('?'));
    context = {};
  } else {
    hash = uri.hash;
    query = uri.query || {};
    context = uri.context || {};
  }
  
  var q = new Queue();
  
  this.routes.forEach(function(route) {
    
    if (!route.exp.test(hash)) return;
    
    var result = route.exp.exec(hash);
    
    var params = {};
    
    route.keys.forEach(function(key, index) {
      params[key.name] = result[index + 1];
    });
    
    q.add(function(next) {
      context.uri = hash;      
      if (!context.params) {
        context.params = params;
      } else {
        for (var key in params) {
          context.params[key] = params[key];
        }
      }
      context.query = query;
      context.next = next;
      context.error = function(err) {
        next({ error: err });
      };
      context.result = function(result) {
        next({ result: result || true });
      };
      route.callback(context, next);
    });
  });
  
  q.end(function(out) {
    out = out || {};
    if (out.error) return cb(out.error);
    cb(null, out.result || false);
  });
}


/**
 * Expose
 */

exports = module.exports = Router;