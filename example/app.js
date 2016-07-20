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
