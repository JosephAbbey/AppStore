front.send('apps');

var appsShowing = 0;
front.on('app', function (app) {
    if (appsShowing > 4) {
        return;
    }
    console.log(app);
    document.getElementById('apps').innerHTML += `
    <a class="d-flex text-muted pt-3" href="./app.html?app=${app.id}">
        <img
            class="flex-shrink-0 me-2 rounded"
            width="32"
            height="32"
            style="margin-right: 10px"
            src="${app.icon}"
        >

        <p class="pb-3 mb-0 small lh-sm border-bottom w-100">
            <strong class="d-block text-gray-dark">${app.name}</strong>
            ${app.description ? app.description : 'No description.'}
        </p>
    </a>`;
    appsShowing++;
});
