import { createContext, useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {where,query, getFirestore, collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "fixmycode1.firebaseapp.com",
    projectId: "fixmycode1",
    storageBucket: "fixmycode1.appspot.com",
    messagingSenderId: "511116035241",
    appId: "1:511116035241:web:d3311e446603ff762f55b8",
    measurementId: "G-RN2WZ3HG06"
  };

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);


const googleProvider = new GoogleAuthProvider();

const addToHistory = async(id, userName, data) => {
    await addDoc(collection(firestore, 'History'), {
        UID : id,
        Email : userName,
        code : data
    })
}
const getHistory = (userId) => {
    const historyCollection = collection(firestore, 'History');
    const userHistoryQuery = where('UID', '==', userId);
    const userHistory = query(historyCollection, userHistoryQuery);

    return getDocs(userHistory);
}


const getHistoryById = async (id) => {
    const docRef = doc(collection(firestore, 'History'), id);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }


export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);
    const [textValue, setTextValue] = useState('');
    const [apiResponseReceived, setApiResponseReceived] = useState(false);
    
    const signup = async (email, password) => {
        try{await createUserWithEmailAndPassword(firebaseAuth, email, password);
        }catch(err){
            alert(err);
            console.log(err);
        }
    };

    const login = async (email, password) => {
        try{
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        }catch(err){
            alert(err.message);
            console.log(err);
        }
    }
    const googleSignIn = async() => {
        signInWithPopup(firebaseAuth, googleProvider);
    }
    const logout = async () => {
        try{
            await signOut(firebaseAuth);
            console.log("logged out");
          }catch(err){
            console.error(err);
          }
    }
    return (
        <FirebaseContext.Provider value={{signup, login, googleSignIn, logout, addToHistory, user, setUser, getHistory, getHistoryById, textValue, setTextValue , apiResponseReceived, setApiResponseReceived}}>
            {props.children}
        </FirebaseContext.Provider>
    )
}

