export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

type ToastCallback = (toast: ToastMessage) => void
const listeners = new Set<ToastCallback>()

export const toast = {
  subscribe(listener: ToastCallback) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  show(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9)
    listeners.forEach((l) => l({ id, type, message }))
  },
  success(message: string) {
    this.show(message, 'success')
  },
  error(message: string) {
    this.show(message, 'error')
  },
  warning(message: string) {
    this.show(message, 'warning')
  },
  info(message: string) {
    this.show(message, 'info')
  },
}
