import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import {
  getFirestore,
  FieldValue,
  Timestamp,
  AggregateField,
  Filter,
} from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const firebaseAppConfig = {
  apiKey: 'AIzaSyBqUf-zfqV1rAw3IVCWkNkgUeZ_JdSjdTw',
  authDomain: 'pubsub-example-0531.firebaseapp.com',
  projectId: 'pubsub-example-0531',
  storageBucket: 'pubsub-example-0531.firebasestorage.app',
  messagingSenderId: '533824016773',
  appId: '1:533824016773:web:464ecb694f02bbc06af4ec',
};

const databaseId = `(default)`; // change database if restoring from backup. Default is `(default)`

export const app =
  admin.apps.length === 0 ? initializeApp(firebaseAppConfig) : admin.app();
export const firestore = getFirestore(databaseId); // change database
export const messaging = getMessaging(app);

export { FieldValue, Timestamp, AggregateField, Filter };
