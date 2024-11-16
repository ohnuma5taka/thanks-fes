import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { StoreService } from '@/app/core/services/store.service';
import { Router } from '@angular/router';
import { env } from '@/environments/env';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { jsonUtil } from '@/app/core/utils/json.util';

export enum HttpStatusCodeEnum {
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  methodNotAllowed = 405,
  timeout = 408,
  conflict = 409,
  internalServerError = 500,
  notImplemented = 501,
  serviceUnavailable = 503,
}

@Injectable()
export class ApiInterceptor {
  constructor(
    private store: StoreService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!request.url.startsWith('/')) next.handle(request);
    const urlPrefix = request.url.startsWith('/assets') ? '' : env.apiBasePath;

    const req = request.clone({
      url: this.encode(urlPrefix + request.url),
      body: jsonUtil.toSnakeCase(request.body),
      params: request.params,
    });
    if (!request.url.startsWith('/assets')) {
      console.log(
        'req',
        {
          method: request.method,
          url: request.method === 'GET' ? req.urlWithParams : req.url,
        },
        request.method === 'GET' ? '' : req.body
      );
    }

    return next.handle(req).pipe(
      map((res) => this.handleResponse(res)),
      catchError((err) => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
  }

  private encoder = (_: string, value: any) =>
    typeof value === 'string' ? value.replace(/%/g, '%25') : value;

  private encode = <T>(data: T): T =>
    data ? JSON.parse(JSON.stringify(data, this.encoder)) : '';

  private handleResponse<T>(res: HttpEvent<T>) {
    if (res instanceof HttpResponse) {
      if (!res.url?.includes('/assets')) {
        const url = '/' + res.url.split('/').slice(3).join('/');
        const body =
          typeof res.body === 'string' ? res.body.slice(0, 20) : res.body;
        console.log('res', { url, headers: res.headers }, body);
      }
    }
    return res;
  }

  private handleError(err: HttpErrorResponse) {
    if (!err) {
      const msg =
        '通信に失敗しました。しばらく待機した後に再度アクセスをお願いします。\n状態が改善されない場合は担当者へお問合せ下さい。';
      this.snackbar.error(msg);
      return;
    }
    switch (err.status) {
      // any error handlings
      default:
        console.error(err);
        break;
    }
  }
}
