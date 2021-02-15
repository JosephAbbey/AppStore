var id = 1;
front.send('get app', id);

front.on('app', function (app) {
    console.log(app);
    document.title = document.getElementById('name').innerText = app.name;
    document.getElementById('content').innerHTML = `
    <svg
            class="bd-placeholder-img flex-shrink-0 me-2 rounded"
            width="90"
            height="90"
            style="margin-top: 20px; margin-left: 20px; margin-right: 10px; display: inline-flex"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: 32x32"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
        >
            <rect width="100%" height="100%" fill="#007bff"></rect>
            <text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
        </svg>
        <div class="bg-light rounded" style="padding: 22px; display: inline-flex; min-height: 70px;">
            <p>${
                app.decription ? app.decription : 'No Description.'
            }<br /><small>${app.version}</small></p>
        </div><button onclick="front.send("install", ${
            app.url
        })" style="margin: 20px" type="button" class="btn">Install</button>`;
});
