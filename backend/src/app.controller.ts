import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('getHello');
    return this.appService.getHello();
  }

  @Post(`/api/register-push-token`)
  registerPushToken(
    @Body()
    body: {
      pushToken: string;
      uniqueInstallationId: string;
      userId: string;
    },
  ): void {
    // TODO : validate userId!
    // no need to validate uniqueInstallationId!
    // because uniqueInstallationId is not shared to other users. They cannot guess.

    /*
      1. find all existing documents with provided uniqueInstallationIds 
      2. find all existing documents with provided pushToken
      3. remove from all that are not mine
      4. set the token mine.
        simple : track only last registered token
        advanced : track all tokens.
    */

    /*
    const scannedDocumentsDict: Record<string, UserPushTokenBag> = {}

    // find all existing documents with provided uniqueInstallationIds 
    if (uniqueInstallationId) {
      const userPushTokenBagsFromUniqueInstallationId =
        await getUserPushTokenBagsFromUniqueInstallationId(uniqueInstallationId)
      userPushTokenBagsFromUniqueInstallationId.forEach((document) => {
        scannedDocumentsDict[document.userId] = document
      })
    }
      
    // find all existing documents with provided pushToken
    if (pushToken) {
      const userPushTokenBagsFromPushToken =
        await getUserPushTokenBagsFromPushToken(pushToken)
      userPushTokenBagsFromPushToken.forEach((document) => {
        scannedDocumentsDict[document.userId] = document
      })
    }

    const scannedDocuments = Object.values(scannedDocumentsDict)
    logInfo(`scanned ${scannedDocuments.length} documents`)

    const notMineUserIds = scannedDocuments
      .map((doc) => doc.userId)
      .filter((e) => e !== userId)

    logInfo(`notMineUserIds : [${notMineUserIds.join(`, `)}]`)

    // remove from all that are not mine
    // log out from instances
    for (let i = 0; i < notMineUserIds.length; i += 1) {
      await removePushToken({
        userId: notMineUserIds[i],
        pushToken: pushToken || null,
        uniqueInstallationId,
      })
    }

    // set to mine.
    // set push token!
    if (userId) {
      await setPushToken({
        uniqueInstallationId,
        pushToken: pushToken || null,
        userId,
      })
    }
    */

    console.log(body);
  }
}
