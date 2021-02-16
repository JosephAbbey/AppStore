const back = require('androidjs').back;
const http = require('http');
const { request, gql } = require('graphql-request');
const fs = require('fs');
const { spawn } = require('child_process');

const addr = JSON.parse(fs.readFileSync('./config/addresses.json'));

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
    back.send('toast', { msg: `Downloading ${url}`, d: 1 });
    const file = fs.createWriteStream('./tmp.apk');
    http.get(url, function (response) {
        response.pipe(file);
    });
    back.send('toast', { msg: `Installing` });
    spawn('java -jar ./install.java', (e, stdout, stderr) => {
        console.log(e, stdout, stderr);
    });
    back.send('toast', { msg: `Installed` });
    fs.rmSync('./tmp.apk');
});
