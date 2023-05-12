var assert  = require('assert');
var Queue   = require('..');



describe('Queue', function() {

  it('#constructor', function() {
    assert(new Queue instanceof Queue);
    assert(Queue() instanceof Queue);
  });
  
  it('#add', function() {
    assert(typeof Queue().add === 'function');
    assert(Queue().add.length === 1);
    assert(Queue().add(function(next){}) instanceof Queue);
  });
  
  it('#done', function() {
    assert(typeof Queue().done === 'function');
    assert (Queue().done.length == 1);
  });
  
  it('should call next item in the queue on #next, and #done last', function(done) {
    var expect = 0;
    var q = Queue();
    q.add(function(next) {
      expect++;
      next();
    }); 
    q.add(function(next) {
      expect++;
      next();
    });
    q.done(function(error) {
      assert(expect === 2);
      done();
    });
  });
  
  it('should throw when #next is called multiple times', function(done) {
    Queue()
      .add(function(next) {
        next();
        assert.throws(next);
        done();
      })
      .done(function(error){});
  });
  
  it('should throw when #add is called with a non-function', function() {
    assert.throws(Queue.add, false, 'Add expects a function');
  });
  
  it('should throw when #done is called with a non-function', function() {
    assert.throws(Queue.done, false, 'Add expects a function');
  });
    
  it('should stop execution once #next is called with an error', function(done) {
    var expect = 0;
    var q = Queue();
    q.add(function(next) {
      expect++;
      next('Error');
    })
    q.add(function(next) {
      expect++;
      next();
    })
    q.done(function(error) {
      assert(expect === 1);
      assert(error === 'Error');
      done();
    });
  });
  
  it('should execute queue with a custom scope', function(done) {
    var result;
    Queue(1,2,3)
      .add(function(a, b, c, next) {
        result = a + b + c;
        next();
      })
      .done(function(error, a, b, c) {
        assert(!error);
        assert(a === 1);
        assert(b === 2);
        assert(c === 3);
        assert(result === 6);
        done();
      });
  });
});