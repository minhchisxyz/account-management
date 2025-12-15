import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClient, HttpHandler, provideHttpClient} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {MAT_DATE_LOCALE} from "@angular/material/core";

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  provideHttpClient(),
    provideAnimationsAsync(),
    provideMomentDateAdapter(MY_FORMATS),
    {provide: MAT_DATE_LOCALE, useValue: 'de'}, provideAnimationsAsync(),
  ]
};
