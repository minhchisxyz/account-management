
const months: {
  [key: string]: number
} = {
  'january': 1,
  'february': 2,
  'march': 3,
  'april': 4,
  'may': 5,
  'june': 6,
  'july': 7,
  'august': 8,
  'september': 9,
  'october': 10,
  'november': 11,
  'december': 12
}

const reverseMonths: {
  [key: number]: string
} = {
  1: 'january',
  2: 'february',
  3: 'march',
  4: 'april',
  5: 'may',
  6: 'june',
  7: 'july',
  8: 'august',
  9: 'september',
  10: 'october',
  11: 'november',
  12: 'december'
}

export function getMonthName(month: number) {
  return reverseMonths[month]
}

export function getMonthNumber(month: string) {
  return months[month]
}

export function formatEuro(amount: number, locale: string = "de-DE"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function formatVND(amount: number, locale: string = "vi-VN"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
}