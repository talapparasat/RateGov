import * as firebase from "firebase/app";
import "firebase/messaging";

const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBepbwg455WQBxzr0p2sC6FOjKbX-Cz0kA",
    authDomain: "digital-agent-32243.firebaseapp.com",
    databaseURL: "https://digital-agent-32243.firebaseio.com",
    projectId: "digital-agent-32243",
    storageBucket: "digital-agent-32243.appspot.com",
    messagingSenderId: "266114030832",
    appId: "1:266114030832:web:666bd4cacdf39836963635",
    measurementId: "G-E9DESRP3CS"
});
let messaging = '';
if (firebase.messaging.isSupported()) {
    messaging =  initializedFirebaseApp.messaging();
    messaging.usePublicVapidKey(
        "BG7mePeZlAmYSqk3AhuPbIpdmkmkb0qXw0lg5h8IXo5uapjLAZcmo9WezIoLSOfVh8_pXwfUb0AkwhGV7CUVkEI"
    );
}




export { messaging };