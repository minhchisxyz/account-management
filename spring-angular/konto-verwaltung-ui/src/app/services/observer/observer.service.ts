import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ObserverService {

  private objectUpdateSource = new BehaviorSubject<any>(null);
  objectUpdate$ = this.objectUpdateSource.asObservable();
  private objectDetailSource = new BehaviorSubject<any>(null);
  objectDetail$ = this.objectDetailSource.asObservable();


  constructor() { }

  updateNotify(newObject: any) {
    this.objectUpdateSource.next(newObject);
  }

  detailNotify(object: any) {
    this.objectDetailSource.next(object)
  }
}
