import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  private monthValues: any = {
      'January': 1,
      'February': 2,
      'March': 3,
      'April': 4,
      'May': 5,
      'June': 6,
      'July': 7,
      'August': 8,
      'September': 9,
      'October': 10,
      'November': 11,
      'December': 12,
  }

  private monthNames: any = {
    'January': 'Januar',
    'February': 'Februar',
    'March': 'März',
    'April': 'April',
    'May': 'Mai',
    'June': 'Juni',
    'July': 'Juli',
    'August': 'August',
    'September': 'September',
    'October': 'Oktober',
    'November': 'November',
    'December': 'Dezember',
  }

  private monthDays: any = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
  }

  public getMonthNameDE(month: string) : string{
    return this.monthNames[month]
  }
  public getMonthValue(month: string): number {
    return this.monthValues[month]
  }

  public reformatDate(date: string): string {
    return new Date(date).toLocaleDateString('de-DE')
  }

  public getDate(option: string): Date | null {

    const now = new Date()
    switch (option) {
      case 'week': {
        if (now.getDate() > 7) {
          return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
        } else {
          if (now.getMonth() > 0) {
            return new Date(now.getFullYear(), now.getMonth() - 1, this.monthDays[now.getMonth() - 1] + now.getDate() - 6)
          } else {
            return new Date(now.getFullYear() - 1, 11, 31 + now.getDate() - 6)
          }
        }
      }
      case 'month': {
        return new Date(now.getFullYear(), now.getMonth(), 1)
      }
      case '3months': {
        if (now.getMonth() > 1) {
          return new Date(now.getFullYear(), now.getMonth() - 2, 1)
        } else {
          return new Date(now.getFullYear() - 1, 11 + now.getMonth() - 2, 1)
        }
      }
      case '6months': {
        if (now.getMonth() > 4) {
          return new Date(now.getFullYear(), now.getMonth() - 5, 1)
        } else {
          return new Date(now.getFullYear() - 1, 11 + now.getMonth() - 5, 1)
        }
      }
      case '9months': {
        if (now.getMonth() > 7) {
          return new Date(now.getFullYear(), now.getMonth() - 8, 1)
        } else {
          return new Date(now.getFullYear() - 1, 11 + now.getMonth() - 8, 1)
        }
      }
      case 'year': {
        return new Date(now.getFullYear() - 1, now.getMonth(), 1)
      }
    }
    return null
  }
}
