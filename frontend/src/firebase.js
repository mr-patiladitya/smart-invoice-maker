// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBqeUPo93Qi8agHIYpxvm0VvcD6exizShw',
  authDomain: 'smart-invoice-maker-66487.firebaseapp.com',
  projectId: 'smart-invoice-maker-66487',
  storageBucket: 'your-app.appspot.com',
  messagingSenderId: '...',
  appId: '25672820400'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
