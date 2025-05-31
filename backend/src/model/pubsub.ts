// in memory handles

import { firestore } from './firebase';

type Callback<T> = (message: T) => void;

/*
    {
        userId: {
           connectionId: callback
    }
    }
*/
// not pretty typing
const callbacks: Record<string, Record<string, Callback<any>>> = {};
// if count is 0, remove listener to the pubsub backend which is firebase.
// userId -> frontend connection count
const subscriptionCounts: Record<string, number> = {};

// userId -> unsubscribe handle
const firebaseUnsubscribeHandles: Record<string, () => void> = {};

// check local state
setInterval(() => {
  const callbackLogCounts: Record<string, Array<string>> = {};

  Object.entries(callbacks).forEach(([userId, callbacks]) => {
    callbackLogCounts[userId] = Object.keys(callbacks);
  });

  console.log(
    JSON.stringify(
      {
        callbackLogCounts,
        subscriptionCounts,
        firebaseUnsubscribeHandlesKeys: Object.keys(firebaseUnsubscribeHandles),
      },
      null,
      2,
    ),
  );
}, 5000);

// subscribe globally for now. later, we can subscribe to multiple messages, but right now we don't care.
// if you want more precise control, just migrate to graphql subscriptions.
// right now lets just use string.
// better implementation will use generic types.
export const subscribe = async <T>(
  connectionId: string,
  userId: string,
  callback: (message: T) => void /*, topic: string */,
) => {
  let userNewlyAdded = false;

  if (userId in callbacks) {
    callbacks[userId][connectionId] = callback;
  } else {
    callbacks[userId] = { [connectionId]: callback };
    userNewlyAdded = true;
  }

  // subscription count
  if (userId in subscriptionCounts) {
    subscriptionCounts[userId]++;
  } else {
    subscriptionCounts[userId] = 1;
  }

  if (userNewlyAdded) {
    // document!!
    const documentPath = `/pubsub-handles/${userId}`;
    // if document doesn't exist, create it.
    const document = await firestore.doc(documentPath).get();
    if (!document.exists) {
      // race condition safe!
      await firestore.doc(documentPath).set(
        {},
        {
          merge: true,
        },
      );
    }

    const unsubscribeHandle = firestore
      .doc(documentPath)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.data() as T;
        Object.values(callbacks[userId]).forEach((callback) => {
          callback(data);
        });
      });

    firebaseUnsubscribeHandles[userId] = unsubscribeHandle;
  }
};

export const unsubscribe = (
  connectionId: string,
  userId: string /*, topic: string */,
) => {
  if (!(userId in callbacks)) {
    console.warn(`User ${userId} not found in callbacks`);
    return;
  }

  delete callbacks[userId][connectionId];

  subscriptionCounts[userId]--;
  if (subscriptionCounts[userId] === 0) {
    // user count became zero. unsubscribe from firebase.
    firebaseUnsubscribeHandles[userId]();
    delete firebaseUnsubscribeHandles[userId];
    delete subscriptionCounts[userId];
    delete callbacks[userId];
  }
};
