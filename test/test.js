var server = require('./support/server.js')
var uri = server.uri
var koa = require('koa')
var request = require('supertest')
var koaRequest = require('../index')
var expect = require('chai').expect;

describe('koa-http-request', function() {
    it('get', function(done) {
        var app = koa()

        app.use(koaRequest())

        app.use(function* () {
            var res = yield this.get(uri)
            expect(res).to.be.equal('/')
            done()
        })
         
        request(app.listen()).get('/').end(function() {})
    })

    it('post', function(done) {
        var app = koa()

        app.use(koaRequest())

        app.use(function* () {
            var res = yield this.post(uri, {
                name: 'junyiz'
            })
            res = JSON.parse(res)
            expect(res.name).to.be.equal('junyiz')
            done()
        })
         
        request(app.listen()).get('/').end(function() {})
    })
})
