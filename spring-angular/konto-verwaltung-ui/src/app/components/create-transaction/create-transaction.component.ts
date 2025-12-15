import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {TransactionRequest} from "../../api-services/models/transaction-request";
import {TransactionService} from "../../api-services/services/transaction.service";
import {NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatDatepickerModule
} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ObserverService} from "../../services/observer/observer.service";

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTransactionComponent implements OnInit{
  readonly date = new FormControl(moment());
  tranRequest: TransactionRequest = {value: 0, description: '', date: ''}
  msg: string = ''
  id: number = 0
  editMode: boolean = false

  constructor(
    private transactionService: TransactionService,
    private observer: ObserverService
  ) {
  }

  ngOnInit(): void {
    this.observer.objectDetail$.subscribe(object => {
      if (object && object.type == 'update') {
        this.id = object.object.id
        this.editMode = true
        this.tranRequest.value = object.object.value
        this.tranRequest.description = object.object.description

        const date = new Date(object.object.date)
        this.date.setValue(moment([date.getFullYear(), date.getMonth(), date.getDate()]))
      } else if (object && object.type == 'reset') {

        this.tranRequest.value = 0
        this.tranRequest.description = ''
        this.msg = ''
        this.id = 0
        this.editMode = false
      }
    })
  }

  addTransaction() {
    if (!this.tranRequest.date){
      this.tranRequest.date = new Date().toISOString().slice(0, 10)
    }

    this.transactionService.createTransaction({
        body: this.tranRequest
      }
    ).subscribe({
      next: res => {
        this.msg = 'Erfolgreich hinzugefügt'
        this.observer.updateNotify(res)
        setTimeout(() => this.reset(), 1000)
      },
      error: err => console.log(err),
    })
  }

  updateDate(dateObject: any) {
    const ctrValue = this.date.value ?? moment()
    this.tranRequest.date = ctrValue.format('YYYY-MM-DD');
  }

  reset() {
    const now = new Date()
    this.date.setValue(moment([now.getFullYear(), now.getMonth(), now.getDate()]))
    this.msg = ''
    this.tranRequest = {value: 0, description: '', date: ''}
  }

  update() {
    const ctrValue = this.date.value ?? moment()
    this.tranRequest.date = ctrValue.format('YYYY-MM-DD');

    this.transactionService.updateTransaction({
      id: this.id,
      body: this.tranRequest
    }).subscribe({
      next: value => {
        console.log(value)
        this.msg = 'Erfolgreich aktualisiert'
        this.observer.updateNotify(value)
        setTimeout(() => this.reset(), 1000)
      }
    })
  }
}
