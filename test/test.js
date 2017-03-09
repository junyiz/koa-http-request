var server = require('./support/server.js')
var uri = server.uri
var koa = require('koa')
var request = require('supertest')
var koaRequest = require('../index')
var expect = require('chai').expect

describe('koa-http-request 2', function() {
    it('get', function(done) {
        var app = new koa()

        app.use(koaRequest({dataType: ''}))

        app.use(async ctx => {
            var res = await ctx.get(uri)
            expect(res).to.be.equal('/')
            done()
        })
         
        request(app.listen()).get('/').end(function() {})
    })

    it('head', function(done) {
        var app = new koa()

        app.use(koaRequest({dataType: ''}))

        app.use(async ctx => {
            var res = await ctx.head(uri)
            expect(res).to.be.equal('')
            done()
        })

        request(app.listen()).get('/').end(function() {})
    })

    it('post', function(done) {
        var app = new koa()

        app.use(koaRequest({dataType: 'json'}))

        app.use(async ctx => {
            var res = await ctx.post(uri, {
                name: 'junyiz'
            })
            expect(res.name).to.be.equal('junyiz')
            done()
        })
         
        request(app.listen()).get('/').end(function() {})
    })

    it('put', function(done) {
        var app = new koa()

        app.use(koaRequest({dataType: 'json'}))

        app.use(async ctx => {
            var res = await ctx.put(uri, {
                name: 'junyiz'
            })
            expect(res.name).to.be.equal('junyiz')
            done()
        })

        request(app.listen()).get('/').end(function() {})
    })

    it('delete', function(done) {
        var app = new koa()

        app.use(koaRequest({dataType: ''}))

        app.use(async ctx => {
            var res = await ctx.delete(uri, {
                name: 'junyiz'
            })
            expect(res).to.be.equal('DELETE')
            done()
        })

        request(app.listen()).get('/').end(function() {})
    })
})
