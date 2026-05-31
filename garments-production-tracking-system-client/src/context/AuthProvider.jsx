import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

// Social Login Provider
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // functions for create user and update name, photoUrl
    function createUser(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function updateUserProfile(user, data){
        return updateProfile(user, data);
    }

    // function for login
    function loginUser(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    // manage user state / observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,  (user) => {
            if(user){
                setCurrentUser(user);
                setLoading(false);
            } else{
                setCurrentUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // handle Logout
    function logoutUser(){
        return signOut(auth);
    }
    // continue with google
    function continueWithGoogle(){
        return signInWithPopup(auth, googleProvider);
    }

    // setting up all context in a object
    const AuthInfo = {
        currentUser,
        createUser,
        updateUserProfile,
        loginUser,
        logoutUser,
        loading,
        continueWithGoogle
    }
    return(
        <AuthContext.Provider value={AuthInfo}>
            {
                children
            }
        </AuthContext.Provider>
    )
}