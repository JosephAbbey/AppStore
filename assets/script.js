front.send('ready');

front.on('app', function (app) {
    $('#msg').html(msg);
});
