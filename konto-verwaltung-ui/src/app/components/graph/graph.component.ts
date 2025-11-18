import {
  Component, EventEmitter,
  Input, OnChanges,
  OnInit, Output,
  SimpleChanges,
} from '@angular/core';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {CurrencyManagementService} from "../../services/currency-service/currency-management.service";
import {FormsModule} from "@angular/forms";
import {DateService} from "../../services/date-service/date.service";
import {LoaderComponent} from "../loader/loader.component";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    CanvasJSAngularChartsModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    LoaderComponent,
    MatInput,
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit, OnChanges {

  @Input() yTitle: string = ''
  @Input() xTitle: string = ''
  @Input() title: string = ''
  @Input() currency: boolean = false
  @Input() usingDate: boolean = false
  @Input() vcbDataPoints: any[] = []
  @Output() changeRateEvent = new EventEmitter<string>()
  filteredVCBDataPoints: any[] = []
  input: string = ''
  rate: number = 0
  result: number = 0
  newRate: string = ''
  loaded: boolean = false

  titles: any = {
    none: 'Geldwechselsrate von EUR zu VND',
    week: 'Geldwechselsrate von EUR zu VND innerhalb 7 Tagen',
    month: 'Geldwechselsrate von EUR zu VND dieses Monats',
    '3months': 'Geldwechselsrate von EUR zu VND in letzten 3 Monaten',
    '6months': 'Geldwechselsrate von EUR zu VND in letzten 6 Monaten',
    '9months': 'Geldwechselsrate von EUR zu VND in letzten 9 Monaten',
    year: 'Geldwechselsrate von EUR zu VND in diesem Jahr'
  }

  chartOptions: any = {
    title: {
      text: "Ausgeben und Einkommen"
    },
    data: [{
      type: "line",
      dataPoints: [
        {label: "Start", y: 0}
      ]
    }]
  }

  constructor(
    protected service: CurrencyManagementService,
    private dateService: DateService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loaded = false
    this.ngOnInit()
  }

  ngOnInit(): void {
    this.newRate = ''
    this.filteredVCBDataPoints = this.vcbDataPoints
    if (this.currency) this.filter('week')
    else if (this.usingDate) this.init()
    this.prepareData()
    setTimeout(() => this.loaded = true)
  }

  init() {
    this.filteredVCBDataPoints = this.vcbDataPoints.map(rate => ({
      label: this.dateService.reformatDate(rate.label),
      y: rate.y
    }))
  }

  prepareData() {
    if (this.currency) {
      this.rate = this.vcbDataPoints[this.vcbDataPoints.length - 1].y
      this.result = this.rate
      this.chartOptions = {
        title: {
          text: this.title,
          fontFamily: "sans-serif",
          fontWeight: "bold"
        },
        animationEnabled: true,
        axisX: {
          title: this.xTitle,
          fontFamily: "sans-serif"
        },
        axisY: {
          fontFamily: "sans-serif",
          suffix: ` ${this.yTitle}`
        },
        toolTip: {
          shared: true
        },
        data: [
          {
            type: "spline",
            name: "VCB Rate",
            showInLegend: true,
            dataPoints: this.filteredVCBDataPoints,
            fontFamily: "sans-serif"
          }
        ]
      }
    } else {
      this.chartOptions = {
        title: {
          text: this.title,
          fontFamily: "sans-serif",
          fontWeight: "bold"
        },
        animationEnabled: true,
        axisX: {
          title: this.xTitle,
          fontFamily: "sans-serif"
        },
        axisY: {
          fontFamily: "sans-serif",
          suffix: ` ${this.yTitle}`
        },
        toolTip: {
          shared: true
        },
        data: [
          {
            type: "spline",
            name: "VCB Rate",
            showInLegend: true,
            dataPoints: this.filteredVCBDataPoints,
            fontFamily: "sans-serif"
          }
        ]
      }
    }
  }

  filter(option: string) {
    this.loaded = false
    if (option == 'none') {
      this.init()
    } else {
      const begin = this.dateService.getDate(option) || new Date()
      this.filteredVCBDataPoints = this.vcbDataPoints.slice().filter(p => new Date(p.label) >= begin).map(rate => ({
        label: this.dateService.reformatDate(rate.label),
        y: rate.y
      }))
    }
    this.title = this.titles[option]
    this.prepareData()
    setTimeout(() => {
      this.loaded = true
    })
  }

  calculate() {
    try {
      const input = Number(this.input)
      if (input) {
        this.result = input * this.rate
      } else {
        this.result = this.rate
      }
    } catch (error) {
      this.result = this.rate
    }
  }

  changeRate() {
    this.changeRateEvent.emit(this.newRate)
  }
}
