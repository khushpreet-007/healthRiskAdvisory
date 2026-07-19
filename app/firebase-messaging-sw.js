importScripts(
    'https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js'
);

importScripts(
    'https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js'
);


firebase.initializeApp({
    apiKey: "AIzaSyAggcDKEzNMq_kNuHslsEYymY9266ylLeg",
    authDomain: "cloud-messaging-1a6fa.firebaseapp.com",
    projectId: "cloud-messaging-1a6fa",
    appId: "1:818981624218:web:742245211ed05944dec223"
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

