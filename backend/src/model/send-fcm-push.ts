import { messaging } from './firebase';
import type { MulticastMessage } from 'firebase-admin/messaging';
// import { expirePushToken } from '../expire-token';

const tokenExpireErrorCodes = [
  `messaging/invalid-recipient`,
  `messaging/invalid-argument`,
  `messaging/invalid-registration-token`,
  `messaging/registration-token-not-registered`,
];
const validationErrorCodes = [
  `messaging/authentication-error`,
  `messaging/mismatched-credential`,
  `messaging/invalid-apns-credentials`,
  `messaging/too-many-topics`,
  `messaging/invalid-package-name`,
  `messaging/invalid-options`,
  `messaging/payload-size-limit-exceeded`,
  `messaging/invalid-data-payload-key`,
];
const retriableErrorCodes = [
  `messaging/server-unavailable`,
  `messaging/internal-error`,
  `messaging/unknown-error`,
  `messaging/topics-message-rate-exceeded`,
  `messaging/device-message-rate-exceeded`,
  `messaging/message-rate-exceeded`,
];

export const handlePushFailure = async ({
  code, // https://firebase.google.com/docs/cloud-messaging/send-message#admin
  /* eslint-disable @typescript-eslint/no-unused-vars */
  pushToken,
  userId,
}: {
  code: string;
  pushToken: string;
  userId: string;
  // eslint-disable-next-line
}) => {
  // if fail, we need to revoke tokens on certain scenarios!
  if (tokenExpireErrorCodes.includes(code)) {
    // implement this!
    // await expirePushToken({
    //   pushToken,
    //   userId,
    // });
  }
};

export const sendFCMPush = async ({
  userId,
  title,
  body,
  url,
  imageUrl,
  tokens,
}: {
  userId: string;
  title: string;
  body: string;
  url: string;
  imageUrl?: string;
  tokens: string[];
}): Promise<any> => {
  // }): Promise<SendPushOutput> => {
  let totalCount = 0;
  let successCount = 0;
  let failCount = 0;
  let expireCount = 0;
  let validationFailCount = 0;
  let retryCount = 0;
  let unknownErrorCount = 0;

  let message: MulticastMessage = {
    notification: {
      title,
      body,
    },
    data: {
      url,
    },
    tokens,
  };

  if (imageUrl) {
    message = {
      ...message,
      android: {
        notification: {
          imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcmOptions: {
          imageUrl,
        },
      },
      webpush: {
        headers: {
          image: imageUrl,
        },
      },
    };
  }

  // https://firebase.google.com/docs/cloud-messaging/send-message
  const response = await messaging.sendEachForMulticast(message);

  for (let i = 0; i < response.responses.length; i += 1) {
    totalCount += 1;
    const resp = response.responses[i];

    // logInfo(`notification response payload : ${JSON.stringify(resp, null, 2)}`);

    const pushToken = tokens[i];
    const success = resp.success;
    if (!success) {
      failCount += 1;
      const error = resp.error;
      const code = error?.code || `unknown`;
      // Currently we're not tracking individual retries.
      // If all requests are expire or retry request, we'll retry.
      // else, we won't retry. partial success dont retry.

      if (tokenExpireErrorCodes.includes(code)) {
        expireCount += 1;
      } else if (validationErrorCodes.includes(code)) {
        validationFailCount += 1;
      } else if (retriableErrorCodes.includes(code)) {
        retryCount += 1;
      } else {
        unknownErrorCount += 1;
      }

      //   logError(`fcm-push failed for token : \n${pushToken}`);
      //   logError(JSON.stringify(error, null, 2));

      if (code) {
        // handle failed tokens!
        await handlePushFailure({
          userId,
          code,
          pushToken,
        });
      }
    } else {
      successCount += 1;
    }
  }

  return {
    successCount,
    failCount,
    expireCount,
    validationFailCount,
    retryCount,
    unknownErrorCount,
    totalCount,
  };
};
