import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../../api-services/services/transaction.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CreateTransactionComponent} from "../create-transaction/create-transaction.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ObserverService} from "../../services/observer/observer.service";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    CreateTransactionComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLinkActive
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{

  years : number[] = []

  constructor(
    private transactionService: TransactionService,
    private observer: ObserverService
  ) {
  }

  ngOnInit(): void {
    this.transactionService.getAllYears()
      .subscribe(
        {
          next: res => this.years = res,
          error: err => console.log(err),
        }
      )
  }

  reset() {
    this.observer.detailNotify({
      type: 'reset'
    })
  }
}
