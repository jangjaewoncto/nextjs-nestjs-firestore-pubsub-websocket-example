export const sendPushToUser = async ({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  userId,
  title,
  body,
  url,
  imageUrl,
}: {
  userId: string;
  title: string;
  body: string;
  url: string;
  imageUrl?: string;
  // eslint-disable-next-line
}) => {
  throw new Error(`not implemented`);
  /* 
  const data = await readDirectly<UserPushTokenBag>(
    `/user-push-token-bags/${userId}`,
  );

  if (!data) {
    logError(`Push token registration not found for user : ${userId}`);
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      expireCount: 0,
      validationFailCount: 0,
      retryCount: 0,
      unknownErrorCount: 0,
      message: `registration not found`,
    };
  }

  const pushTokens = data.pushTokenIndex; /// push token string[]

  if (!pushTokens) {
    logError(
      `pushTokenIndex not found for push token registration user : ${userId}`,
    );
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      expireCount: 0,
      validationFailCount: 0,
      retryCount: 0,
      unknownErrorCount: 0,
      message: `index not found`,
    };
  }
  if (pushTokens.length === 0) {
    logError(
      `pushTokenIndex length zero for push token registration user : ${userId}`,
    );
    return {
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      expireCount: 0,
      validationFailCount: 0,
      retryCount: 0,
      unknownErrorCount: 0,
      message: `index length zero`,
    };
  }

  let totalCount = 0;
  let successCount = 0;
  let failCount = 0;
  let expireCount = 0;
  let validationFailCount = 0;
  let retryCount = 0;
  let unknownErrorCount = 0;

  if (pushTokens.length > 0) {
    const pushResult = await sendPush({
      userId,
      title,
      body,
      url,
      imageUrl,
      tokens: pushTokens,
    });
    totalCount += pushResult.totalCount;
    successCount += pushResult.successCount;
    failCount += pushResult.failCount;
    expireCount += pushResult.expireCount;
    validationFailCount += pushResult.validationFailCount;
    retryCount += pushResult.retryCount;
    unknownErrorCount += pushResult.unknownErrorCount;
  }

  return {
    successCount,
    failCount,
    totalCount,
    expireCount,
    validationFailCount,
    retryCount,
    unknownErrorCount,
  };
  */
};
