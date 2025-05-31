'use client'

const overwriteToDeviceStorage = async (key: string, value: string) => {
  console.log(`overwriteToDeviceStorage`, key, value)
}

const deleteFromDeviceStorage = async (key: string) => {
  console.log(`deleteFromDeviceStorage`, key)
}

export const registerPushToken = async ({
  pushToken,
}: {
  pushToken: string | null
}) => {
  console.log(`registerPushToken`)
  if (pushToken) {
    // save locally.
    // const { userId } = getClientAuth()
    const userId = `handsomejang`
    if (userId) {
      await overwriteToDeviceStorage(`latestPushTokenRegisteredUserId`, userId)
    } else {
      // unregister scenario.
      // non-authenticated registerPushToken call will revoke the token.
      // even if uniqueInstallationId has changed, the token is removed
      // via pushToken query.
      await deleteFromDeviceStorage(`latestPushTokenRegisteredUserId`)
    }
    await overwriteToDeviceStorage(`pushToken`, pushToken)
  } else {
    // unregister scenario.
    // token is removed via uniqueInstallationId in the server

    await deleteFromDeviceStorage(`latestPushTokenRegisteredUserId`)
    await deleteFromDeviceStorage(`pushToken`)
  }


  // send server POST

  // const client = getClient()
  // const result = await client.mutate({
  //   mutation,
  //   variables: {
  //     input: {
  //       uniqueInstallationId: getUniqueInstallationId(),
  //       pushToken,
  //     },
  //   },
  // })

  // tryThrowError(result.errors)
  // notify if error 
}


/*
unique installation id logic


  'use client'
import { get, set } from '@infrastructure/framework/preferences'
import { createUuid } from '@util/framework/uuid'
//

let cachedUniqueInstallationId: string | null = null

export const registerUniqueInstallationId = async () => {
  const prev = await get(`uniqueInstallationId`)

  if (prev) {
    cachedUniqueInstallationId = prev
  } else {
    const uuid = createUuid(20)
    await set(`uniqueInstallationId`, uuid)
    cachedUniqueInstallationId = uuid
  }
}

export const getUniqueInstallationId = (): string => {
  if (!cachedUniqueInstallationId) {
    throw new Error(`UniqueInstallationId not initialized!`)
  }

  return cachedUniqueInstallationId
}

if (typeof window !== `undefined`) {
  registerUniqueInstallationId()
}


*/