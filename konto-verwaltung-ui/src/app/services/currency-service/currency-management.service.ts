import {Injectable} from '@angular/core';
import {CurrencyService} from "../../api-services/services/currency.service";
import {Transaction} from "../../api-services/models/transaction";

@Injectable({
  providedIn: 'root'
})
export class CurrencyManagementService{

  private rate: number = 0
  constructor(
    private service: CurrencyService
  ) { }

  public numberInVND(x: number):string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(
      x,
    )
  }

  public numberInEUR(x: number):string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
      x,
    )
  }

  public sum(transactions: Transaction[]): number {
    let sum = 0;
    for (let t of transactions) {
      sum += t.value ? t.value : 0
    }
    return sum
  }

  public getRate(): number {
    if (!this.rate) {
      this.service.getTodayRate({
        bank: 'vib'
      }).subscribe({
        next: value => {
          this.rate = value.rate || 1
        }
      })
    }
    return this.rate
  }
}
