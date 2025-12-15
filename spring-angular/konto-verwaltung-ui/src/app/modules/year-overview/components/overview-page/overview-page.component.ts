import {Component} from '@angular/core';
import {CreateTransactionComponent} from "../../../../components/create-transaction/create-transaction.component";
import {NavigationYearComponent} from "../navigation-year/navigation-year.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    CreateTransactionComponent,
    NavigationYearComponent,
    RouterOutlet
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent{

}
