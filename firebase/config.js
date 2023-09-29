import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCalag4kyljINWiPfcMtwXtAaBT_ZqpQE4",
  authDomain: "react-nativepfs.firebaseapp.com",
  projectId: "react-nativepfs",
  storageBucket: "react-nativepfs.appspot.com",
  messagingSenderId: "193380924986",
  appId: "1:193380924986:web:60c4ae3a6769fb7b693f03",
  measurementId: "G-4HZ8W6EPY0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
