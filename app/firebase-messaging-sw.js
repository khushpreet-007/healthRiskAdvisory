importScripts(
    'https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js'
);

importScripts(
    'https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js'
);



firebase.initializeApp({
    apiKey: "AIzaSyDC8TBV5wqf2DX9jRblHmZEnv69l6IPr3c",
    authDomain: "imageedit-498605.firebaseapp.com",
    projectId: "imageedit-498605",
    appId: "1:931055668161:web:3a68b7b7f2e63a6b357d40"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(
    (payload) => {


        self.registration.showNotification(

            payload.notification.title,

            {

                body:
                    payload.notification.body

            }

        );


    });

