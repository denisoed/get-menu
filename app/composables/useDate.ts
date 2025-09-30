import { SETTINGS } from '~/config/settings';

export interface Date {
  fmt: (n: number) => string;
}

const useDate = () => {
  const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ' + SETTINGS.currency;
  return {
    fmt
  }
}

export default useDate;