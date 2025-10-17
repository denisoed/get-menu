export {}

declare global {
  interface TelegramWebApp {
    ready(): void
    expand?(): void
    disableVerticalSwipes?(): void
    setBackgroundColor?(color: string): void
    setHeaderColor?(color: string): void
    onEvent?<T = unknown>(eventType: string, handler: (event: T) => void): void
  }

  interface TelegramNamespace {
    WebApp?: TelegramWebApp
  }

  interface Window {
    Telegram?: TelegramNamespace
  }
}
