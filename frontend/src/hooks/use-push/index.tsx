import React from 'react'
import { useAsyncCallback } from '../use-async-callback'
import { initialize as initializeApp, register, unregister } from './app'
import { registerPushToken } from './register-push-token'
import { PushNotificationPermissionState } from './types'




  const readFromDeviceStorage = async (key: string) => {
    return `NOT_IMPLEMENTED`
  }


const PushPermissionActionsContext = React.createContext<{
  checkPermission: () => Promise<PushNotificationPermissionState>
  requestPermission: () => Promise<PushNotificationPermissionState>
}>({
  checkPermission: async () => `default`,
  requestPermission: async () => `default`,
})

const PushPermissionStateContext =
  React.createContext<PushNotificationPermissionState>(`default`)


export const PushProvider = ({ children }: { children: React.ReactNode }) => {
    // const { userId } = useAuth()
    const userId = `handsomejang`

    const [pushNotificationPermissionState, setPushNotificationPermissionState] =
      React.useState<PushNotificationPermissionState>(`default`)
  
    /*
      check permission and if granted, register;
    */
    const checkPermission = useAsyncCallback(async () => {
      const permission = await checkPermission()
  
      setPushNotificationPermissionState(permission)
      

      if (permission === `granted`) {
        // automatically registers to the server!
        await register()
      }
      return permission
    }, [])
  
    /*
      request permission and if granted, register;
    */
    const requestPermission = useAsyncCallback(async () => {
      // if not logged in, we cannot request permission!!
  
      const permission = await requestPermission()
      setPushNotificationPermissionState(permission)
      
      if (permission === `granted`) {
        // automatically registers to the server!
        await register()
      }
      return permission
    }, [])
  
    /*
    syncs local token to the server;
    push token might be registered locally but the network request might have failed;
  */
    const sync = useAsyncCallback(async () => {
      // if latestRegisteredUserId !== userId, unsubscribe locally;
      // this will ensure logout || change auth -> reenter call unsubscribe;
      // then, we'll register again;
      const latestPushTokenRegisteredUserId = await readFromDeviceStorage(
        `latestPushTokenRegisteredUserId`,
      )
      if (
        latestPushTokenRegisteredUserId &&
        (userId || null) !== latestPushTokenRegisteredUserId
      ) {
        // userId state changed!
        await unregister()
      }
  
      const permission = await checkPermission()
      if (permission === `granted`) {
        // if permission was granted, it will fire register on its side;
        // nothing else to sync!
      } else {
        // if permission is not granted, server still tries to fire,
        // but the client won't display it.
        // nothing to handle by registration side.
        // sync to server with previous token;
        const pushToken = await readFromDeviceStorage(`pushToken`)
  
        if (pushToken) {
          await registerPushToken({
            pushToken,
          })
        }
      }
    }, [checkPermission, userId])
  
    // when userId change, always sync!
    React.useEffect(() => {
      
      sync()
    }, [userId, sync])
  
    const handle = React.useMemo(() => {
      return {
        checkPermission,
        requestPermission,
      }
    }, [checkPermission, requestPermission])
  
    return (
      <PushPermissionActionsContext.Provider value={handle}>
        <PushPermissionStateContext.Provider
          value={pushNotificationPermissionState}
        >
          {children}
        </PushPermissionStateContext.Provider>
      </PushPermissionActionsContext.Provider>
    )
  }
  
  export const usePushPermissionActions = () => {
    return React.useContext(PushPermissionActionsContext)
  }
  
  export const usePushPermissionState = () => {
    return React.useContext(PushPermissionStateContext)
  }
  
  // initialize should be done in module scope; cannot wait for render.
  export const initialize = () => {
    console.log(`@push:initialize`)
    initializeApp()
  }
  
  if (typeof window !== `undefined`) {
    initialize()
  }
  