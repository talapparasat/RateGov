
importScripts('https://www.gstatic.com/firebasejs/5.8.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.5/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBepbwg455WQBxzr0p2sC6FOjKbX-Cz0kA",
    authDomain: "digital-agent-32243.firebaseapp.com",
    databaseURL: "https://digital-agent-32243.firebaseio.com",
    projectId: "digital-agent-32243",
    storageBucket: "digital-agent-32243.appspot.com",
    messagingSenderId: "266114030832",
    appId: "1:266114030832:web:666bd4cacdf39836963635",
    measurementId: "G-E9DESRP3CS"
});

const messaging = firebase.messaging.isSupported() ?  firebase.messaging() : null;

messaging.setBackgroundMessageHandler(function(payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            console.log(payload)
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            // return registration.showNotification("Новый отзыв поступил");
        });
    return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
    // const myPromise = new Promise(function(resolve, reject) {
        // Do you work here
        // self.clients.openWindow('https://digitalagent.pro');
        // Once finished, call resolve() or  reject().
    //     resolve();
    // });
    //
    // event.waitUntil(myPromise);
});
self.addEventListener('notificationclose', function(e) {
    // console.log(e)
    // var notification = e.notification;
    // var primaryKey = notification.data.primaryKey;
    //
    // console.log('Closed notification: ' + primaryKey);
});