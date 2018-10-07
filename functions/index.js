const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database.ref('/Alexa/messages/{messageId}').onCreate(
    async (snapshot) => {
      // Notification details.
      const text = snapshot.val().text;
      const payload = {
        notification: {
          title: 'New Message from Peach',
          body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
          //icon: snapshot.val().user.avatar || '/images/profile_placeholder.png',
          //click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
        }
      };

      // Get the list of device tokens.
      const tokenObject = await admin.database().ref('Alexa/token').once('value');
      if (tokenObject.exists()) {
        // Listing all device tokens to send a notification to.
        const token = tokenObject.val();

        // Send notifications to all tokens.
        const response = await admin.messaging().sendToDevice(token, payload);
        admin.messaging()
        //await cleanupTokens(response, token);
        console.log('Notifications have been sent and tokens cleaned up.');
      }
    });