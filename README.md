# koa-http-request
Simplified HTTP request for Koa(2.0+).

# Install

```bash
npm install koa-http-request --save
```

# Usage

```javascript
var koa = require('koa');
var koaRequest = require('koa-http-request');
var app = new koa();

app.use(koaRequest({
  dataType: 'json', //automatically parsing of JSON response
  timeout: 3000,    //3s timeout
  host: 'https://api.github.com'
}));

app.use(async (ctx, next) => {
	var repo = await ctx.get('/repos/junyiz/koa-http-request', null, {
        'User-Agent': 'koa-http-request'
    });
	ctx.body = 'repos id: ' + repo.id + '\nrepos name: ' + repo.full_name;
});

app.listen(process.env.PORT || 8090);
```

# License
MIT
