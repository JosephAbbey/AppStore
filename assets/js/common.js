feather.replace();

front.send('userData', app.getPath('userData'));

front.on('toast', function (o) {
    app.toast.show(o.msg, o.d);
});
