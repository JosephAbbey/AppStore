front.send('ready');

front.on('app', function (app) {
    console.log(app);
});
