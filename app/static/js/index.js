(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(function (registration) {
                    console.log('Service Worker Registered');
                    return registration;
                })
                .catch(function (err) {
                    console.error('Unable to register service worker.', err);
                });
            navigator.serviceWorker.ready.then(function (registration) {
                console.log('Service Worker Ready');
            });
        });
    }
})();

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    location.reload();
}


let deferredPrompt;
// const btnAdd = document.querySelector('#btnAdd');

// window.addEventListener('beforeinstallprompt', (e) => {
//     console.log('beforeinstallprompt event fired');
//     e.preventDefault();
//     deferredPrompt = e;
//     btnAdd.style.visibility = 'visible';
// });

// btnAdd.addEventListener('click', (e) => {
//     btnAdd.style.visibility = 'hidden';
//     deferredPrompt.prompt();
//     deferredPrompt.userChoice
//         .then((choiceResult) => {
//             if (choiceResult.outcome === 'accepted') {
//                 console.log('User accepted the A2HS prompt');
//             } else {
//                 console.log('User dismissed the A2HS prompt');
//             }
//             deferredPrompt = null;
//         });
// });

// window.addEventListener('appinstalled', (evt) => {
//     app.logEvent('app', 'installed');
// });