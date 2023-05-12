# queue

[![wercker status](https://app.wercker.com/status/7aa55ee6d0f0ecc0ab21220d2d2eb2d3/m "wercker status")](https://app.wercker.com/project/bykey/7aa55ee6d0f0ecc0ab21220d2d2eb2d3)

FIFO queue for node and browser

### Example

    Queue()
      .add(function(next){ console.log(1); next(); })
      .add(function(next){ console.log(2); next(); })
      .add(function(next){ console.log(3); next(); })
      .end(function(error){ console.log(error, 'finish'); }); // -> 1 ; 2 ; 3 ; undefined, 'finish'
    

    var q = new Queue();
    q.add(function(next){ setInterval(function(){ next(); }, 1000); });
    q.end(function(error){}); // -> will throw an error, after 2000ms (on second tick)
    
    var q = new Queue(4, 2);
    q.add(function(n, m, next) { console.log(n,m); });
    q.end(function(){}); // -> 4, 2
    
### Author

Vladimir Popov <rusintez@gmail.com>

### License

MIT