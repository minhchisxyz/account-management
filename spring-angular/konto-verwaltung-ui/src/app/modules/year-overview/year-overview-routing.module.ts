import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewPageComponent} from "./components/overview-page/overview-page.component";
import {MonthDetailsComponent} from "./components/month-details/month-details.component";
import {YearDetailsComponent} from "./components/year-details/year-details.component";

const routes: Routes = [
  {
    path: ':year',
    component: OverviewPageComponent,
    children:[
      {
        path: '',
        component: YearDetailsComponent
      },
      {
        path: 'months/:month',
        component: MonthDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearOverviewRoutingModule { }
