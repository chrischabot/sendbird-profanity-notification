importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAhjlh7ynaXSckj87ZBTA_ujvPmdgPhm7k",
    authDomain: "sendbird-notify-profanit-b2eff.firebaseapp.com",
    projectId: "sendbird-notify-profanit-b2eff",
    storageBucket: "sendbird-notify-profanit-b2eff.appspot.com",
    messagingSenderId: "298710397749",
    appId: "1:298710397749:web:b6f9f8126f1884d312927c",
    measurementId: "G-C6Q8MJ2LZ1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = 'Profanity filter triggered';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/sendbird-logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
