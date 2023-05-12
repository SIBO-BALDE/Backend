# qs

Querystring decode / encode for node and browser

### Changelog

`1.0.1`:

- Run tests before publish / commit

`1.0.0`:

- Initial release

### Installation

    $ npm install seed-qs --save

### Usage

    var qs = require('qs');
    qs({ a: 'b', c: 1 }); // 'a=b&c=1'
    qs.parse('a=b&c=1'); // { a: 'b', c: 1 }

### Development

    $ git clone git@github.com:seedalpha/qs.git
    $ cd qs
    $ npm install
    $ npm test

### Author

Vladimir Popov <vlad@seedalpha.net>

### License

©2014 Seedalpha