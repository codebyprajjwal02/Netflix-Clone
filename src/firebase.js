import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword,
         getAuth,
         signInWithEmailAndPassword,
         signOut} from "firebase/auth";
import {addDoc,
        collection,      
        getFirestore} from "firebase/firestore";
import {toast} from 'react-toastify';        
const firebaseConfig = {
  apiKey: "AIzaSyASOE1VY5uVNfDT1BR73SuZPxwasTkdu9Y",
  authDomain: "netflix-clone-ec2a5.firebaseapp.com",
  projectId: "netflix-clone-ec2a5",
  storageBucket: "netflix-clone-ec2a5.firebasestorage.app",
  messagingSenderId: "821988621696",
  appId: "1:821988621696:web:44b622fc1087d4642e9565"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const signup = async(name,email,password)=>{
  try{
    const res = await createUserWithEmailAndPassword(auth,email,password);
    const user = res.user;
    await addDoc(collection(db,"user"),{
      uid: user.uid,
      name,
      authProvider:"local",
      email,
    });
  }catch(error){
    console.error("Error signing up:",error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}
const login= async(email,password)=>{
  try{
    await signInWithEmailAndPassword(auth,email,password);
  }catch(error){
     console.log(error);
      toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}
const logout=()=>{
  signOut(auth);
}
export{auth,db,login,signup,logout};

