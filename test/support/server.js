var app = require('koa')()
var koaBody = require('koa-body')

app.use(koaBody())
app.use(function* (next) {
    if (this.method == 'POST') {
        this.body = this.request.body
    } else {
        this.body = this.path
    }
})

app.listen(5000)

exports.uri = 'http://localhost:5000'
