const { back } = require('androidjs');
const http = require('http');
const { request, gql } = require('graphql-request');
const fs = require('fs');
const { spawnSync } = require('child_process');

const addr = { registry: 'http://netley.ruins:5500' };
var path;
back.on('userData', function (s) {
    path = s;
});

back.on('apps', function () {
    const query = gql`
        {
            apps {
                id
                name
                description
                url
                version
                icon
            }
        }
    `;

    request(addr.registry, query).then((data) => {
        console.log(data);
        for (var app of data.apps) {
            back.send('app', app);
        }
    });
});

back.on('get app', function (id) {
    const query = gql`
        {
			getAppById(id: ${id}) {
				name
				description
				url
                icon
				version
			}
        }
    `;

    request(addr.registry, query).then((data) => {
        console.log(data);
        back.send('app', data.getAppById);
    });
});

back.on('install', function (url) {
    var APKpath = `${path}/tmp.apk`;
    back.send('toast', { msg: `Downloading ${url}`, d: 0 });
    http.get(url, function (res) {
        res.on('data', function (data) {
            fs.appendFileSync(APKpath, data);
        });
        res.on('end', function () {
            back.send('toast', { msg: `Installing`, d: 0 });
            var out = spawnSync('pm', ['install', APKpath], {});
            console.log(out);
            back.send('toast', { msg: `Installed`, d: 0 });
            // fs.rm(APKpath);
        });
    });
});
