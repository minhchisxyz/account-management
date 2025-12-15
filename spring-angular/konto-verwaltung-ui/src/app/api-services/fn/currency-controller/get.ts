/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Response } from '../../models/response';

export interface Get$Params {
  url: string;
}

export function get(http: HttpClient, rootUrl: string, params: Get$Params, context?: HttpContext): Observable<StrictHttpResponse<Response>> {
  const rb = new RequestBuilder(rootUrl, get.PATH, 'get');
  if (params) {
    rb.query('url', params.url, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Response>;
    })
  );
}

get.PATH = '/currency';
