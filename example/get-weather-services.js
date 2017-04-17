let koa = require('koa');
let koaRequest = require('koa-http-request');
let app = new koa();

app.use(koaRequest({
  dataType: 'json'
}));

app.use(async ctx => {
  let geolocation = await ctx.get('https://ipinfo.io');
  let loc = geolocation.loc.split(',');
  // {APIKEY} need to replace yourself
  let weather = await ctx.get('http://api.openweathermap.org/data/2.5/weather?lat=' + loc[0] + '&lon=' + loc[1] + '&APPID={APIKEY}')

  ctx.body = weather;
});

app.listen(process.env.PORT || 8090);
