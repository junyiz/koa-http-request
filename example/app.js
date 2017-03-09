var koa = require('koa');
var koaRequest = require('../index'); //koa-http-request
var app = new koa();

app.use(koaRequest({
  dataType: 'json',
  host: 'https://api.github.com'
}))

app.use(async ctx => {
	var repo = await ctx.get('/repos/junyiz/koa-http-request', null, {
      'User-Agent': 'koa-http-request'
  });
	ctx.body = 'repos id: ' + repo.id + '\nrepos name: ' + repo.full_name;
});

app.listen(process.env.PORT || 8090);
