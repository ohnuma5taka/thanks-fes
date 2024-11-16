import { Panelist } from '@/app/core/models/panelist.model';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';

type StoreKey = 'panelist';

const objectKeys: StoreKey[] = ['panelist'];
const arrayKeys: StoreKey[] = [];

@Injectable()
export class StoreService implements OnDestroy {
  private onSubject = <T>(): Subject<{ key: string; value: T }> =>
    new Subject();
  changes = <T>() => this.onSubject<T>().asObservable().pipe(share());

  constructor() {
    this.initialize();
  }

  ngOnDestroy() {
    this.finalize();
  }

  private set<T>(key: StoreKey, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    this.onSubject<T>().next({ key, value });
  }

  private get<T>(key: StoreKey): T {
    const value = localStorage.getItem(key) || '';
    return !!value && value !== 'undefined'
      ? JSON.parse(value)
      : objectKeys.includes(key)
      ? {}
      : arrayKeys.includes(key)
      ? []
      : '';
  }

  clear(key: StoreKey) {
    localStorage.removeItem(key);
    this.onSubject<null>().next({ key, value: null });
  }

  clearAll() {
    localStorage.clear();
  }

  public setters = {
    panelist: (value: Panelist) => this.set<Panelist>('panelist', value),
  };

  public getters = {
    panelist: () => this.get<Panelist>('panelist'),
  };

  private initialize() {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    const key = event.key || '';
    const value = event.newValue ? JSON.parse(event.newValue) : '';
    if (event.storageArea == localStorage) {
      this.onSubject<any>().next({ key, value });
    }
  }

  private finalize() {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.onSubject<any>().complete();
  }
}
