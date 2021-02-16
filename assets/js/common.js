const { front } = require('androidjs');

feather.replace();

front.on('toast', function (o) {
    app.toast.show(o.msg, o.d);
});
