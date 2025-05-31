# nextjs-nestjs-firestore-pubsub-websocket-example

nextjs-nestjs-firestore-pubsub-websocket-example

This is minimal. Sorry no lint.



1. Create GCP Project
2. Create service account with
   1. cloud datastore user
   2. firebase messaging api admin
3. download service account to backend/secrets/service-account.json
4. create firebase project
5. copy paste firebase config json. (currently in backend/model/firebase.ts)
6. run frontend server : PORT=3000 npm run dev
7. run backend server : PORT=3001 npm run start:dev
8. open firestore console (console.firebase.google.com) and write to documents to see the realtime changes in the web client.
