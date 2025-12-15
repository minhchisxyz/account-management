import { Component, OnInit} from '@angular/core';
import {TransactionService} from "../../api-services/services/transaction.service";
import {NgIf} from "@angular/common";
import {CurrencyService} from "../../api-services/services/currency.service";
import {GraphComponent} from "../graph/graph.component";
import {CurrencyManagementService} from "../../services/currency-service/currency-management.service";
import {ObserverService} from "../../services/observer/observer.service";
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-account-balance',
  standalone: true,
  imports: [
    NgIf,
    GraphComponent,
    LoaderComponent
  ],
  templateUrl: './account-balance.component.html',
  styleUrl: './account-balance.component.scss'
})
export class AccountBalanceComponent implements OnInit{

  loaded: boolean = false
  balance: number = 0
  rate: number = 0
  dataPoints: any[] = []
  title: string = ''
  xTitle: string = ''
  yTitle: string = ''

  constructor(
    private transactionService: TransactionService,
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
    this.init()
    this.title = 'Jährliche Analyse'
    this.xTitle = 'Jahr'
    this.yTitle = '€'

    this.currencyService.getTodayRate({
      bank: 'vcb'
    }).subscribe({
      next: val => {
        console.log(val)
        this.rate = val.rate || 0
        this.loaded = true
      }
    })
  }

  init() {
    this.transactionService.getAllYearTotals().subscribe({
      next: val => {
        this.balance = val.map(t => t.total || 0)
          .reduce((total, current) => total + current, 0)
        this.dataPoints = val.map(t => ({
          y: t.total,
          label: t.year
        }))
      }
    })
  }

  protected readonly Math = Math;
}
