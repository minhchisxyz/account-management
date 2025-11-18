
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

export function formatDate(date: string): string {
    const parts = date.split("-")
    return `${parts[2]}/${parts[1]}/${parts[0]}`
}