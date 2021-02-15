front.send('ready');

front.on('app', function (app) {
    console.log(app);
    $('#apps').innerHTML += `
    <div class="d-flex text-muted pt-3">
        <svg
            class="bd-placeholder-img flex-shrink-0 me-2 rounded"
            width="32"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: 32x32"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
        >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#007bff"></rect>
            <text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
        </svg>

        <p class="pb-3 mb-0 small lh-sm border-bottom">
            <strong class="d-block text-gray-dark">${app.name}</strong>
            ${app.description ? app.description : 'No description.'}
        </p>
    </div>`;
});
