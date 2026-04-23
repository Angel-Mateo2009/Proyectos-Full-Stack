importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "BAD7-UcWAPLvULh_1tLHbL4mg6SiI5KoSlzR2O3Xt4c2zNuhGx3DoNGrSEA4R6iM6RWZNnvUg58lL-NIIvkWU1A",
  authDomain: "teo-motors.firebaseapp.com",
  projectId: "teo-motors",
  storageBucket: "teo-motors.firebasestorage.app",
  messagingSenderId: "752827905684",
  appId: "1:752827905684:web:50dbb0cddbdc922681a681"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icono.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});