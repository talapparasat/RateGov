var admin = require("firebase-admin");

var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://digital-agent-32243.firebaseio.com"
});

let registrationToken = "d4RvJCcivXY:APA91bGeEkK85lnfQ2rKZ08SdYPEf5AywiahbUFCp6rMCNln4UslSUMJ8NNQ0Q09LSj5wFkeNLi0kJMam6ZbKZBSRwP9kdExSkC5AyxejeqJTPpw62Mm8LJPuh9Nkl47-mpGMxfGiyDB";

/*let payload = {
    notification: {
        title: "Account Deposit1",
        body: "A deposit to your savings account has just cleared."
    }
};*/

let payload = {
    data: {
        title: "Title",
        body: "Body",
        user_id: "awdaw",
        aawda: "Wadaw"
    }
};

let options = {
    priority: "high",
    // timeToLive: 60 * 60 *24
};


admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });