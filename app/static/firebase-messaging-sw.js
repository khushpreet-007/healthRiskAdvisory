importScripts(
'https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js'
);

importScripts(
'https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js'
);


firebase.initializeApp({
    apiKey: "xx",
    authDomain: "cloud-messaging-1a6fa.firebaseapp.com",
    projectId: "cloud-messaging-1a6fa",
    messagingSenderId: "xxx",
    appId: "1:xxx:web:xxx"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(
(payload)=>{


    self.registration.showNotification(

        payload.notification.title,

        {

        body:
        payload.notification.body

        }

    );


});