const back = require('androidjs').back;
// const { request, gql } = require('graphql-request');

back.on('hello from front', function () {
    back.send('hello from back', 'Hello from Android JS');
});

// const query = gql`
//     {
//         apps {
//             id
//             name
//             description
//             url
//             version
//         }
//     }
// `;

// request('http://netley.ruins:5500', query).then((data) => {
//     console.log(data);
//     for (var app of data.apps) {
//         console.log(app.name);
//     }
// });
