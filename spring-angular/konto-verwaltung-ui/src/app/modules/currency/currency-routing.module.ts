import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CurrencyExchangeComponent} from "./components/currency-exchange/currency-exchange.component";

const routes: Routes = [
  {
    path: '',
    component: CurrencyExchangeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
