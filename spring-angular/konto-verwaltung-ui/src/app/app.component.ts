import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CreateTransactionComponent} from "./components/create-transaction/create-transaction.component";
import * as _moment from 'moment';
import {default as _rollupMoment} from "moment/moment";
import {NavigationComponent} from "./components/navigation/navigation.component";
import {Transaction} from "./api-services/models/transaction";

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateTransactionComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'konto-verwaltung-ui';

  public sum(transactions: Transaction[]): number {
    let sum = 0;
    for (let t of transactions) {
      sum += t.value ? t.value : 0
    }
    return sum
  }

  public reformatDate(date: string): string {
    let temp = date.split('-')
    return `${temp[2]}-${temp[1]}-${temp[0]}`
  }

  public numberWithCommas(x: number):string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  constructor() {
    moment.updateLocale('de', {
      months: [
        'Januar',
        'Februar',
        'Marsch',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      monthsShort: [
        'Januar',
        'Februar',
        'Marsch',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
      ],
      weekdays: [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7'
      ],
      weekdaysShort: [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7'
      ],
      weekdaysMin: [
        'So',
        'Mo',
        'Di',
        'Mi',
        'Do',
        'Fr',
        'Sa'
      ]
    })
  }
}
