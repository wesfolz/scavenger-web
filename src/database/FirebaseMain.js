import firebase from 'firebase';

export default class FirebaseMain {
    // 2.
    static init() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyC02ylU8_0j3D01Y0YyYkJi5fA-q_T20iM",
                authDomain: "scavenger-5be15.firebaseapp.com",
                databaseURL: "https://scavenger-5be15.firebaseio.com",
                projectId: "scavenger-5be15",
                storageBucket: "scavenger-5be15.appspot.com",
                messagingSenderId: "75285980680"
            });
        }
    }

    static getGoalsRef() {
        return firebase.database().ref('Goals');
    }

    static getGoalRef(goal) {
        return firebase.database().ref('Goals/' + goal);
    }

    static getMessageRef(user) {
        return firebase.database().ref(user + '/messages');
    }

    static getLocationRef(user) {
        return firebase.database().ref(user + '/location');
    }

    static getCurrentGoalRef() {
        return firebase.database().ref('CurrentGoal');
    }

    static getFinalGoalStatusRef() {
        return firebase.database().ref('FinalGoal/status');
    }

    static setFinalGoalStatus() {
        FirebaseMain.getFinalGoalStatusRef().set('done');
    }

    static addMessage(user, message) {
        FirebaseMain.getMessageRef(user).push(message);
    }

    static addLocation(user, location) {
        FirebaseMain.getLocationRef(user).push(location);
    }

}