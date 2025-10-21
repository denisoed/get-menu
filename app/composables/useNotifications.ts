import { useState } from '#imports'

export type NotificationKind = 'success' | 'error' | 'info'

export interface AppNotification {
  id: number
  kind: NotificationKind
  message: string
  createdAt: number
}

const AUTO_DISMISS_MS = 6000
const notificationTimers = new Map<number, ReturnType<typeof setTimeout>>()

function scheduleDismiss(id: number, dismiss: (id: number) => void) {
  if (!process.client) {
    return
  }

  const timer = setTimeout(() => {
    notificationTimers.delete(id)
    dismiss(id)
  }, AUTO_DISMISS_MS)

  notificationTimers.set(id, timer)
}

export function useNotifications() {
  const notifications = useState<AppNotification[]>('app-notifications', () => [])

  function dismiss(id: number) {
    const timer = notificationTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      notificationTimers.delete(id)
    }

    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  function notify(kind: NotificationKind, message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const notification: AppNotification = {
      id,
      kind,
      message,
      createdAt: Date.now()
    }

    notifications.value = [...notifications.value, notification]
    scheduleDismiss(id, dismiss)

    return id
  }

  function success(message: string) {
    return notify('success', message)
  }

  function error(message: string) {
    return notify('error', message)
  }

  function info(message: string) {
    return notify('info', message)
  }

  return {
    notifications,
    notify,
    dismiss,
    success,
    error,
    info
  }
}
