var app = require('koa')()
var koaBody = require('koa-body')
const port = 5000

app.use(koaBody())
app.use(function* (next) {
    if (this.method == 'GET') {
        this.body = this.path
    } else if (this.method == 'HEAD') {
        this.body = ''
    } else if (this.method == 'POST') {
        this.body = this.request.body
    } else if (this.method == 'PUT') {
        this.body = this.request.body
    } else if (this.method == 'DELETE') {
        this.body = 'DELETE'
    }
})

app.listen(port)

exports.uri = 'http://localhost:' + port
