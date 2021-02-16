feather.replace();

front.send('appData', app.getPath('appData'));

front.on('toast', function (o) {
    app.toast.show(o.msg, o.d);
});
