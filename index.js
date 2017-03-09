var http = require('http');
var https = require('https');
var urlParse = require('url').parse;
var qsStringify = require('querystring').stringify;
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var options = {
    host: '',
    dataType: '',
    timeout: 30000
};

/**
 *  @param {Object} params
 */
function createParams(params) {
    var ret = [];

    for (var i in params) {
        ret.push(i + '=' + encodeURIComponent(params[i]));
    }

    return ret.join('&');
}

/**
 *  @param {String} url  
 *  @param {String} method  GET | HEAD | POST | PUT | DELETE
 *  @param {Object} headers
 */
function createOptions(url, method, headers) {
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
 *  @param {String} method  GET | HEAD | POST | PUT | DELETE
 */
function request(method) {
    return function (url, params, headers) {
        var cb, result, req, abort, opts, httpReqeust;

        url = /^http/.test(url) ? url : options.host + url;
        httpReqeust = /^https/.test(url) ? https.request : http.request;

        function done() {
            if (options.dataType == 'json') {
                try {
                    result = JSON.parse(result);
                } catch(e) {
                    result = e;
                }
            }
            cb(result);
        }

        function error(e) {
            clearTimeout(abort);
            cb(JSON.stringify(e));
        }

        if ((method == 'GET' || method == 'HEAD') && typeof params === 'object' && params !== null) {
            url += (url.indexOf('?') > -1 ? '&' : '?') + createParams(params);
        }

        opts = createOptions(url, method, headers);

        if (method == 'POST' || method == 'PUT') {
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

        if ((method == 'POST' || method == 'PUT') && params) {
            req.write(params);
        }

        req.end();

        return new Promise(function(resolve) {
            cb = resolve;
        });
    }
}

module.exports = function(opts) {
    options = Object.assign(options, opts || {});

    return async function(ctx, next) {
        ctx.get = request('GET');
        ctx.head = request('HEAD');
        ctx.post = request('POST');
        ctx.put = request('PUT');
        ctx.delete = request('DELETE');

        await next();
    }
}
