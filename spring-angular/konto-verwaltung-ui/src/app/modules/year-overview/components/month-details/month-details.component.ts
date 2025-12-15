import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../../../../api-services/services/transaction.service";
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {CurrencyManagementService} from "../../../../services/currency-service/currency-management.service";
import {CurrencyService} from "../../../../api-services/services/currency.service";
import {DateService} from "../../../../services/date-service/date.service";
import {GraphComponent} from "../../../../components/graph/graph.component";
import {ObserverService} from "../../../../services/observer/observer.service";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {LoaderComponent} from "../../../../components/loader/loader.component";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-month-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    GraphComponent,
    MatIconModule,
    MatButtonModule,
    LoaderComponent,
    MatTooltipModule,
  ],
  templateUrl: './month-details.component.html',
  styleUrl: './month-details.component.scss'
})
export class MonthDetailsComponent implements OnInit {

  loaded: boolean = false
  rate: number = 1
  year: number = 0
  month: string = ''
  transactions: any[] = []
  indexes: number[] = []
  sum: number = 0
  dataPoints: any[] = []
  currentSum: number = 0
  title: string = ''
  xTitle: string = ''
  yTitle: string = ''

  constructor(
    private transactionService: TransactionService,
    private router: ActivatedRoute,
    protected dateService: DateService,
    private currencyService: CurrencyService,
    protected currencyManagementService: CurrencyManagementService,
    private observer: ObserverService
  ) {
  }

  ngOnInit(): void {
    this.observer.objectUpdate$.subscribe(object => {
      if (object) {
        this.init()
      }
    })
    this.currencyService.getTodayRate({
      bank: 'vib'
    }).subscribe({
      next: val => {
        this.rate = val.rate || 0
      }
    })
    this.year = Number(window.location.href.split('/')[4]);
    this.router.params.subscribe(params => {
      this.month = params['month']
      this.init()
    })
  }

  init() {
    this.transactionService.getAllTransactionsOfMonth({
      year: this.year,
      month: this.dateService.getMonthValue(this.month)
    }).subscribe({
      next: res => {
        this.transactions = res.map(t => ({
          transaction: t,
          included: false
        }))
        this.transactions = this.transactions.reverse()

        this.sum = this.currencyManagementService.sum(res)

        this.dataPoints = res.map(t => ({
          label: t.date,
          y: t.value
        }))

        this.title = `Analyse im ${this.dateService.getMonthNameDE(this.month)}`
        this.xTitle = 'Datum'
        this.yTitle = '€'

        setTimeout(() => this.loaded = true)
      },
      error: err => console.log(err)
    })
  }
  protected readonly Math = Math;

  addToSum(index: number): void {
    this.transactions[index].included = true
    this.currentSum += this.transactions[index].transaction.value
    this.indexes.push(index)
  }

  removeFromSum(index: number): void {
    this.transactions[index].included = false
    this.currentSum -= this.transactions[index].transaction.value
    this.indexes = this.indexes.filter(i => i != index)
  }

  protected readonly Array = Array;

  editTransaction(transaction: any) {
    this.observer.detailNotify({
      type: 'update',
      object: transaction.transaction
    })

  }

  deleteTransaction(transaction: any) {
    this.transactionService.deleteTransaction({
      id: transaction.transaction.id || 0
    }).subscribe({
      next: () => {
        this.observer.updateNotify(transaction)
      }
    })
  }
}
