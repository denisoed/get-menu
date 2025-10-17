export {}

declare global {
  interface TelegramOpenLinkOptions {
    try_instant_view?: boolean
  }

  interface TelegramWebApp {
    ready(): void
    expand?(): void
    disableVerticalSwipes?(): void
    setBackgroundColor?(color: string): void
    setHeaderColor?(color: string): void
    onEvent?<T = unknown>(eventType: string, handler: (event: T) => void): void
    openLink?(url: string, options?: TelegramOpenLinkOptions): void
    openTelegramLink?(url: string): void
  }

  interface TelegramNamespace {
    WebApp?: TelegramWebApp
  }

  interface Window {
    Telegram?: TelegramNamespace
  }
}
