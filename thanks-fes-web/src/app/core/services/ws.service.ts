import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, delay, map, retry, tap } from 'rxjs';
import { env } from '@/environments/env';
import { jsonUtil } from '@/app/core/utils/json.util';

export type WebsocketRequest<T> = { data: T };
export type WebsocketResponseData<T> = { data: T };
export type WebsocketResponse<T> = {
  id: string;
  data: WebsocketResponseData<T>;
};
export type WebsocketData<T, U> = WebsocketRequest<T> | WebsocketResponse<U>;

export class WebsocketService<T, U> {
  id: string;
  connection$: WebSocketSubject<WebsocketData<T, U>>;
  url: string;
  callback: (_: WebsocketResponseData<U>) => void = () => {};

  get connected() {
    return this.connection$ && !this.connection$.closed;
  }

  connectWebsocket(url: string) {
    if (this.connected) {
      if (this.url === url) return this.connection$;
      this.disconnectWebsocket();
    }
    this.url = url;
    const protocol = location.protocol.replace('http', 'ws');
    const wsPath = `${protocol}//${location.host}${env.wsBasePath}${url}`;
    this.connection$ = webSocket(wsPath);
    this.connection$
      .pipe(
        map(
          (res: unknown) => jsonUtil.toCamelCase(res) as WebsocketResponse<U>
        ),
        catchError((errors) =>
          errors.pipe(
            tap((err: CloseEvent) => console.error(err)),
            delay(100)
          )
        ),
        retry(2)
      )
      .subscribe({
        next: (res: WebsocketResponse<U>) => {
          this.id = res.id;
          this.callback(res.data);
        },
      });
    return this.connection$;
  }

  submitWebsocket(data: T) {
    if (!this.connected) {
      console.error('websocket disconnected');
      return;
    }
    const _data = jsonUtil.toSnakeCase({ data }) as WebsocketRequest<T>;
    this.connection$.next(_data);
  }

  disconnectWebsocket() {
    if (!this.connected) return;
    this.connection$.unsubscribe();
    this.connection$.complete();
  }
}
