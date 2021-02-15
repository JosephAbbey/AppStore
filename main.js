const back = require('androidjs').back;
const { request, gql } = require('graphql-request');

back.on('ready', function () {
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

    request('http://netley.ruins:5500', query).then((data) => {
        console.log(data);
        for (var app of data.apps) {
            back.send('app', app);
        }
    });
});
