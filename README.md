koa-http-request
===========

Simplified HTTP request for koa.


To install simply run:

```bash
npm install koa-http-request
```

Require koa first and will only work on node v0.11.7 or newer.

You must run node with --harmony flag (--harmony-generators works as well)

```bash
node --harmony example.js
```

Simple example using koa-http-request in koa:

```js
var koa = require('koa');
var koaRequest = require('../index'); //koa-http-request
var app = koa();

app.use(koaRequest());

app.use(function* () {
	var res = yield this.get('https://api.github.com/repos/junyiz/koa-http-request', null, {
        'User-Agent': 'koa-http-request'
    });
	var info = JSON.parse(res);
	this.body = 'repos id: ' + info.id + '\nrepos name: ' + info.full_name;
});

app.listen(process.env.PORT || 8090);
```
