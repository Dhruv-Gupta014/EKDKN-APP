// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAZhM4WBxGfmYFmd-cAgLyzkg4gkkC3FA8',
  authDomain: 'ekdkn-app.firebaseapp.com',
  projectId: 'ekdkn-app',
  storageBucket: 'ekdkn-app.appspot.com',
  messagingSenderId: '853281065242',
  appId: '1:853281065242:web:939f7c1cde3720e69184a3',
  measurementId: 'G-90D8T0ZJX7',
};

const app = initializeApp(firebaseConfig);

// ✅ THIS is where things were breaking earlier
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);


