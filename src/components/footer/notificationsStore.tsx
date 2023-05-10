import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../../utils/storage'

export type NotificationsConfig = {
  notifications: number
}

type NotificationsState = NotificationsConfig & {
  reset: () => void
  setNotifications: (notifications: number) => void
}

export const defaultNotificationState: NotificationsConfig = {
  notifications: 0,
}

export const notificationStorage = createStorage('notifications')

export const notificationStore = createStore(
  persist<NotificationsState>(
    (set) => ({
      ...defaultNotificationState,
      reset: () => set(() => defaultNotificationState),
      setNotifications: (notifications) => set((state) => ({ ...state, notifications })),
    }),
    {
      name: 'notifications',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(notificationStorage)),
    },
  ),
)

export const useNotificationStore = <T, >(
  selector: (state: NotificationsState) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(notificationStore, selector, equalityFn)
