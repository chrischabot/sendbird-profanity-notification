import firebase from 'firebase/app'
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAhjlh7ynaXSckj87ZBTA_ujvPmdgPhm7k",
    authDomain: "sendbird-notify-profanit-b2eff.firebaseapp.com",
    projectId: "sendbird-notify-profanit-b2eff",
    storageBucket: "sendbird-notify-profanit-b2eff.appspot.com",
    messagingSenderId: "298710397749",
    appId: "1:298710397749:web:b6f9f8126f1884d312927c",
    measurementId: "G-C6Q8MJ2LZ1"
});

const messaging = initializedFirebaseApp.messaging();

messaging.getToken('BMrEKfVQQsXegm2fbVBDWwsfzHUybgVNYFRG4kj5YNk2qVGS_3f6-edCbg8O-OTvyXdpPWy-rgSemjB_OnkiVR8')
    .then((token) => {
        if (token) {
            console.log('Push notification token available');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token })
            };
            fetch('https://cctst.uksouth.cloudapp.azure.com/api/registerToken', requestOptions);
        } else {
            console.log('No registration token available');
        }
    })
    .catch(function (err) {
        console.log("Notification registration failed, error:", err);
    });

messaging.onMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received message ', payload);
    new Notification(payload.data.title, {
        icon: '/sendbird-logo.png',
        body: payload.data.body,
    });
});

export { messaging };