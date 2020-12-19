import {NotificationProps} from '@db/Notification'

import admin from 'firebase-admin'
const util = require('util');

import serviceAccount from "./firebase-adminsdk.json";

const firebaseUp = () => {
    console.log('Initializing firebase...');
    admin.initializeApp({
        credential: admin.credential.cert('./firebase-adminsdk.json'),
        databaseURL: "https://digital-agent-32243.firebaseio.com"
    });
};

const sendNotification = (title: string, body: string, type:string, token:string, sourceId: string) => {
    let payload = {
        notification: {
            title,
            body,
            type,
            token,
            sourceId
        }
    };

    let options = {
        priority: "high",
    };

    admin.messaging().sendToDevice(token, payload, options)
        .then(function(response: any) {
            console.log("Successfully sent message:", response);
        })
        .catch(function(error: any) {
            console.log("Error sending message:", error);
        });
};


const sendWebPush = (title: string, body: string, type:string, tokens:string[], sourceId: string) => {

    let message = {
        notification: {
            title,
            body,
        },
        webpush: {
            "headers": {

            },
            fcm_options: {
                link: "https://digitalagent.pro/dashboard/reviews/" + sourceId,
            },
        },

        tokens
    };

    admin.messaging().sendMulticast(message)
        .then(function(response: any) {
            console.log("Successfully sent message:", util.inspect(response, {showHidden: false, depth: null}));
        })
        .catch(function(error: any) {
            console.log("Error sending message:", error);
        });
};


export = {
    admin,
    firebaseUp,
    sendNotification,
    sendWebPush
};