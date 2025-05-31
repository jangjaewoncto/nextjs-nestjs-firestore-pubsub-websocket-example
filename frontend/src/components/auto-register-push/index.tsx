'use client'

// import { useAuth } from '@/src/infrastructure/framework/auth/client'
// import { hookRefreshesWith } from '@/src/util/framework/hook-refreshes-with'
import { useAsyncEffect } from '../../hooks/use-async-effect'
import { usePushPermissionActions } from '../../hooks/use-push'


// example flow of push registration

export const AutoRegisterPush = () => {
  const { checkPermission, requestPermission } = usePushPermissionActions()
  // const { userId } = useAuth()
  const userId = `handsomejang`

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useAsyncEffect(async () => {
    // hookRefreshesWith(userId)
    const permission = await checkPermission()
    if ([`default`, `prompt`, `prompt-with-rationale`].includes(permission)) {
      requestPermission()
    }
  }, [userId, requestPermission, checkPermission])

  return null
}
