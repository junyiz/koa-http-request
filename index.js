var http = require('http');
var https = require('https');
var urlParse = require('url').parse;
var qsStringify = require('querystring').stringify;
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var options = {
    timeout: 2e4
};

/**
 *  @param {Object} params
 */
function getParam(params) {
    var ret = [];

    for (var i in params) {
        ret.push(i + '=' + encodeURIComponent(params[i]));
    }

    return ret.join('&');
}

/**
 *  @param {String} url  
 *  @param {String} method  POST | GET
 *  @param {Object} headers
 */
function getOptions(url, method, headers) {
    url = urlParse(url);

    return {
        hostname: url.hostname,
        port: url.protocol == 'https:' ? url.port || 443 : url.port || 80,
        path: url.path,
        method: method,
        headers: Object.assign({
            'Content-Type': 'application/x-www-form-urlencoded'
        }, headers)
    };
}

/**
 *  @param {String} method  POST | GET
 */
function request(method) {
    return function (url, params, headers) {
        var ctx = this,
            cb, result, called, req, abort, opts,
            httpReqeust = /^https/.test(url) ? https.request : http.request;

        function done() {
            if (!called && result !== undefined && cb) {
                cb.call(ctx, null, result);
                called = true;
            }
        }

        function error(e) {
            clearTimeout(abort);
            result = JSON.stringify({message: e});
            done();
        }


        if (method == 'GET' && typeof params === 'object' && params !== null) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + getParam(params);
        } 

        opts = getOptions(url, method, headers);

        if (method == 'POST') {
            if (typeof params === 'object' && params !== null) {
                params = qsStringify(params);
                opts.headers['Content-Length'] = params.length; 
            } else {
                opts.headers['Content-Length'] = 0; 
            }
        }

        abort = setTimeout(function() {
            req.abort();
            error(url + ' timeout');
        }, options.timeout);

        req = httpReqeust(opts, function(res) {
            var bufferHelper = new BufferHelper();

            clearTimeout(abort);
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            }).on('end', function() {
                result = iconv.decode(bufferHelper.toBuffer(), 'utf8');

                if (res.statusCode === 200) {
                    done();
                } else {
                    error(url + ' : statusCode=' + res.statusCode + '\n' + result);
                }
            });
        });

        req.on('error', error);

        if (method == 'POST' && params) {
            req.write(params);
        }

        req.end();

        return function(fn) {
            cb = fn;
        }
    }
}

module.exports = function(config) {
    options = Object.assign(options, config);

    return function* (next) {
        this.get = request('GET').bind(this);
        this.post = request('POST').bind(this);

        yield next;
    }
}
