var id = 1;
front.send('get app', id);

front.on('app', function (app) {
    console.log(app);
    document.title = document.getElementById('name').innerText = app.name;
    document.getElementById('content').innerHTML = `
    <img
            class="flex-shrink-0 me-2 rounded"
            width="90"
            height="90"
            style="margin-top: 20px; margin-left: 20px; margin-right: 10px; display: inline-flex"
            src="${app.icon}"
        >
        <div class="bg-light rounded" style="padding: 22px; display: inline-flex; min-height: 70px;">
            <p>${
                app.description ? app.description : 'No Description.'
            }<br /><small>${app.version}</small></p>
        </div><button onclick="front.send("install", ${
            app.url
        })" style="margin: 20px" type="button" class="btn">Install</button>`;
});
