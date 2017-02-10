koa-http-request
===========

Simplified HTTP request for koa.


To install simply run:

```bash
npm install koa-http-request
```

Simple example using koa-http-request in koa:

```js
var koa = require('koa');
var koaRequest = require('koa-http-request');
var app = koa();

app.use(koaRequest({
  dataType: 'json', //automatically parsing of JSON response
  timeout: 3000     //3s timeout
}));

app.use(function* () {
	var res = yield this.get('https://api.github.com/repos/junyiz/koa-http-request', null, {
        'User-Agent': 'koa-http-request'
    });
	this.body = 'repos id: ' + info.id + '\nrepos name: ' + info.full_name;
});

app.listen(process.env.PORT || 8090);
```
