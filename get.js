var url = require('url');
var http = require('http');
var https = require('https');
var Stream = require('stream').Transform;

var get = function (uri, cb) {
    'use strict';
    var options = url.parse(uri);
    var response = {};
    if (!options.port && options.protocol === 'http:') {
        options.port = 80;
    } else if (!options.port && options.protocol === 'https:') {
        options.port = 443;
    }
    options.method = 'GET';
    var _http;
    if (options.protocol === 'https:') {
        _http = https;
        // Added both certificate 'IGNORE' checks
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        options.rejectUnhauthorized = false;
    } else {
        _http = http;
    }
    var req = _http.request(options, function createHttpRequest(res) {
        var data = new Stream();
        response.statusCode = res.statusCode;
        response.headers = res.headers;
        res.on('data', function (chunk) {
            data.push(chunk);
        });
        res.on('end', function (x) {
            response.body = data.read();
            cb(null, response);
        });
        req.on('error', function catchError(e) {
            cb(e, null);
        });
    });
    req.end();
};

module.exports = get;
