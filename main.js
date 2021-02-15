const back = require('androidjs').back;
const { request, gql } = require('graphql-request');
const fs = require('fs');

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
				version
			}
        }
    `;

    request(addr.registry, query).then((data) => {
        console.log(data);
        back.send('app', data.getAppById);
    });
});
