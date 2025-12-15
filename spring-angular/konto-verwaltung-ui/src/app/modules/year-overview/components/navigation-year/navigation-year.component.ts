import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TransactionService} from "../../../../api-services/services/transaction.service";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {DateService} from "../../../../services/date-service/date.service";

@Component({
  selector: 'app-navigation-year',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navigation-year.component.html',
  styleUrl: './navigation-year.component.scss'
})
export class NavigationYearComponent implements OnInit {

  months: string[] = []
  year: number = 0

  constructor(
    private transactionService: TransactionService,
    private router: ActivatedRoute,
    protected dateService: DateService
  ) {
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.year = params['year']
      this.transactionService.getAllMonths({
        year: this.year
      }).subscribe({
        next: res => {
          this.months = res.map(val => this.capitalize(val))
        },
        error: err => console.log(err)
      })
    })
  }

  private capitalize(input: string):string {
    let temp:string = input.toLowerCase()
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  }

}
