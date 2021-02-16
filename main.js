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
    back.send('toast', { msg: `Downloading ${url}`, d: 0 });
    const file = fs.createWriteStream(`${path}/tmp.apk`);
    http.get(url, function (response) {
        response.pipe(file);
        back.send('toast', { msg: `Installing`, d: 0 });
        var out = spawnSync('pm', ['install', `${path}/tmp.apk`], {});
        console.log(out);
        back.send('toast', { msg: `Installed`, d: 0 });
        // fs.rm(`${path}/tmp.apk`);
    });
});
