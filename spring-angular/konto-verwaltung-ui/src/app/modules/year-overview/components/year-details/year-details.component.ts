import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TransactionService} from "../../../../api-services/services/transaction.service";
import {ActivatedRoute} from "@angular/router";
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {CurrencyService} from "../../../../api-services/services/currency.service";
import {CurrencyManagementService} from "../../../../services/currency-service/currency-management.service";
import {GraphComponent} from "../../../../components/graph/graph.component";
import {DateService} from "../../../../services/date-service/date.service";
import {ObserverService} from "../../../../services/observer/observer.service";
import {LoaderComponent} from "../../../../components/loader/loader.component";

@Component({
  selector: 'app-year-details',
  standalone: true,
  imports: [
    NgForOf,
    CanvasJSAngularChartsModule,
    NgIf,
    GraphComponent,
    LoaderComponent
  ],
  templateUrl: './year-details.component.html',
  styleUrl: './year-details.component.scss'
})
export class YearDetailsComponent implements OnInit{

  loaded: boolean = false
  rate: number = 1
  months: string[] = []
  year: number = 0
  sum: number = 0
  dataPoints: any[] = []
  title: string = ''
  xTitle: string = ''
  yTitle: string = ''

  constructor(
    private transactionService: TransactionService,
    private router: ActivatedRoute,
    private currencyService: CurrencyService,
    protected currencyManagementService: CurrencyManagementService,
    protected dateService: DateService,
    private observer: ObserverService
  ) {
  }

  ngOnInit(): void {
    this.observer.objectUpdate$.subscribe(object => {
      if (object) {
        this.init()
      }
    })
    this.title = 'Monatliche Analyse'
    this.xTitle = 'Monat'
    this.yTitle = '€'
    this.currencyService.getTodayRate({
      bank: 'vib'
    }).subscribe({
      next: val => {
        this.rate = val.rate || 0
      }
    })
    this.router.params.subscribe(params => {
      this.year = params['year']
      this.init()
    })
  }

  init() {
    this.transactionService.getAllMonthTotals({
      year: this.year
    }).subscribe({
      next: value => {
        this.sum = 0
        this.dataPoints = value.map(mt => ({
          label: this.dateService.getMonthNameDE(this.capitalize(mt.month || '')),
          y: mt.total
        }))
        this.months = value.map(mt => this.capitalize(mt.month || ''))
        value.map(mt => mt.total).forEach(t => this.sum+= t || 0)
        setTimeout(() => this.loaded = true)
      }
    })
  }

  private capitalize(input: string):string {
    let temp:string = input.toLowerCase()
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  }

  protected readonly Math = Math;
}
