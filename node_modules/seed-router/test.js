var assert  = require('assert');
var Router  = require('./');

suite('html');

test('should create an instance of Router', function() {    
  var router = new Router();
  assert.equal(router instanceof Router, true);
});

test('should add a new route handle', function() {
  var router = new Router();
  router.add('/hello', function(ctx) {});
  assert.equal(router.routes.length, 1);
});

test('should trigger route', function(done) {
  var router = new Router();
  var trigger = false;
  
  router.add('/abc', function(ctx) {
    assert.deepEqual(ctx.params, {});
    assert.deepEqual(ctx.query, {});
    assert.equal(ctx.uri, '/abc');
    assert.equal(typeof ctx.next, 'function');
    assert.equal(typeof ctx.error, 'function');
    assert.equal(typeof ctx.result, 'function');
    trigger = true;
    ctx.next();
  });
  
  router.set('/abc', function() {
    assert(trigger);
    done();
  });
});

test('should get route params', function(done) {
  var router = new Router();
  router.add('/abc/:id', function(ctx) {
    assert.equal(ctx.params.id, '123');
    done();
  });
  router.set('/abc/123');
});

test('should get route query', function(done) {
  var router = new Router();
  router.add('/abc/:id', function(ctx) {
    assert.equal(ctx.params.id, '123');
    assert.equal(ctx.query.hello, 123);
    done();
  });
  router.set('/abc/123?hello=123');
});

test('should handle empty uri', function(done) {
  var router = new Router();
  router.add(function(ctx) {
    ctx.next();
  });
  router.set('/', done);
});

test('should handle middleware', function(done) {
  var router = new Router();
  var trigger = 0;
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.set('/', function() {
    assert.equal(trigger, 3);
    done();
  });
});

test('should handle inline middleware', function(done) {
  var router = new Router();
  var trigger = 0;
  
  var middleware = function(ctx) {
    trigger++;
    ctx.next();
  };
  
  router.add(middleware, middleware, middleware);
  
  router.set('/', function() {
    assert.equal(trigger, 3);
    done();
  });
});

test('should handle middleware execution stop on result', function(done) {
  var router = new Router();
  var trigger = 0;
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.add(function(ctx) {
    trigger++;
    ctx.result(555);
  });
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.set('/', function(err, result) {
    assert(!err);
    assert.equal(trigger, 2);
    assert.equal(result, 555);
    done();
  });
});

test('should handle middleware execution stop on error', function(done) {
  var router = new Router();
  var trigger = 0;
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.add(function(ctx) {
    trigger++;
    ctx.error('Middleware Error');
  });
  router.add(function(ctx) {
    trigger++;
    ctx.next();
  });
  router.set('/', function(err, result) {
    assert.equal(trigger, 2);
    assert(!result);
    assert.equal(err, 'Middleware Error');
    done();
  });
});

test('should handle nested routers', function(done) {

  var router = new Router();
  var nested = new Router();
  var trigger = false;
  
  router.add('/namespace', nested);
  
  nested.add(function(ctx) {
    trigger = true;
    ctx.next();
  });
  
  router.set('/namespace', function() {
    assert(trigger);
    done();
  });
});

test('should bubble up errors', function(done) {

  var router = new Router();
  var nested = new Router();
  
  nested.add('/:id', function(ctx) {
    assert(ctx.params.id, '123');
    ctx.error('Nested Error');
  });
  
  router.add('/namespace', nested);
  
  router.set('/namespace/123', function(err, result) {
    assert.equal(err, 'Nested Error');
    done();
  });
});

test('should bubble up results', function(done) {

  var router = new Router();
  var nested = new Router();
  
  router.add('/namespace', nested);
  
  nested.add('/nested/:id', function(ctx) {
    ctx.result(ctx.params.id);
  });
  
  router.set('/namespace/nested/123', function(err, result) {
    assert(!err);
    assert.equal(result, '123');
    done();
  });
});

test('should handle deeply nested routers', function(done) {

  var router = new Router();
  var nested = new Router();
  var deeply = new Router();
  
  router.add(nested);
  nested.add(deeply);
  deeply.add(function(ctx) {
    ctx.result();
  });
  router.set('/', function(err, result) {
    assert(!err);
    assert(result);
    done();
  });
});

test('should handle deeply nested routers with params', function(done) {

  var router = new Router();
  var nested = new Router();
  var deeply = new Router();
  
  router.add('/:a', nested);
  nested.add('/:b', deeply);
  
  deeply.add(function(ctx) {
    assert(ctx.params.a  === 'a');
    assert(ctx.params.b  === 'b');
    ctx.result();
  });
  
  router.set('/a/b', function(err, result) {
    assert(!err);
    assert(result);
    done();
  });
});

test('should maintain a single context', function(done) {

  var router = new Router();
  var nested = new Router();
  var deeply = new Router();
  
  router.add(function(ctx) {
    ctx.a = true;
    ctx.next();
  });
  
  router.add(nested);
  nested.add(deeply);
  
  deeply.add(function(ctx) {
    assert(ctx.a);
    ctx.result();
  });
  
  router.set('/', function(err, result) {
    assert(!err);
    assert(result);
    done();
  });
});

test('should diffirentiate handles and middleware', function(done) {
  var router = new Router();
  
  // middleware
  router.add('/', function(ctx, next) {
    ctx.a = true;
    next();
  });
  
  // middleware
  router.add('/', function(ctx, next) {
    ctx.b = true;
    next();
  });
  
  // handle
  router.add('/', function(ctx) {
    ctx.c = true;
    ctx.result(false);
  });
  
  // another handle
  router.add('/about', function(ctx) {
    assert(ctx.a);
    // assert(ctx.b);
    // assert(ctx.c == undefined);
    ctx.result(true);
  });
  
  router.set('/about', function(err, result) {
    assert(!err);
    assert(result);
    done();
  });
});