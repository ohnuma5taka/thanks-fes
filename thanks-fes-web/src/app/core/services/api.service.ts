import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StoreService } from '@/app/core/services/store.service';
import { jsonUtil } from '@/app/core/utils/json.util';

type FesHttpHeaders =
  | HttpHeaders
  | { [header: string]: string | string[] }
  | undefined;

type HttpOptions = {
  headers?: FesHttpHeaders;
  params?: HttpParams | { [param: string]: string | string[] } | undefined;
  reportProgress?: boolean | undefined;
  responseType?: 'json' | undefined;
  withCredentials?: boolean | undefined;
};

const defaultHttpOptions: HttpOptions = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
};

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private store: StoreService) {}

  async get<T>(url: string, body?: any, headers?: FesHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    if (body) {
      const params = { fromObject: jsonUtil.toSnakeCase(body) as any };
      httpOptions.params = new HttpParams(params);
    }
    const res = await firstValueFrom(this.http.get<T>(url, httpOptions));
    return jsonUtil.toCamelCase(res) as T;
  }

  async post<T>(url: string, body?: any, headers?: FesHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    const _body = jsonUtil.toSnakeCase(body);
    const res = await firstValueFrom(
      this.http.post<T>(url, _body, httpOptions)
    );
    return jsonUtil.toCamelCase(res) as T;
  }

  async put<T>(url: string, body?: any, headers?: FesHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    const _body = jsonUtil.toSnakeCase(body);
    const res = await firstValueFrom(this.http.put<T>(url, _body, httpOptions));
    return jsonUtil.toCamelCase(res) as T;
  }

  async delete<T>(url: string, body?: any, headers?: FesHttpHeaders) {
    const httpOptions = this.setHttpOptions(headers);
    if (body) {
      const params = { fromObject: jsonUtil.toSnakeCase(body) as any };
      httpOptions.params = new HttpParams(params);
    }
    const res = await firstValueFrom(this.http.delete<T>(url, httpOptions));
    return jsonUtil.toCamelCase(res) as T;
  }

  private setHttpOptions(headers?: FesHttpHeaders) {
    if (!headers) return defaultHttpOptions;
    return {
      ...defaultHttpOptions,
      headers: {
        ...defaultHttpOptions.headers,
        ...headers,
      },
    };
  }
}
