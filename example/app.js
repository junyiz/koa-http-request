var koa = require('koa');
var koaRequest = require('../index'); //koa-http-request
var app = koa();

app.use(koaRequest({
  dataType: 'json', //automatically parsing of JSON response
  timeout: 3000,    //3s timeout
  host: 'https://api.github.com'
}));


app.use(function* () {
	var repo = yield this.get('/repos/junyiz/koa-http-request', null, {
        'User-Agent': 'koa-http-request'
    });
	this.body = 'repos id: ' + repo.id + '\nrepos name: ' + repo.full_name;
});

app.listen(process.env.PORT || 8090);
