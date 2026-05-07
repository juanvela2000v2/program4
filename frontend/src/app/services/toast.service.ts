import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();

  private add(message: string, type: Toast['type'], duration = 4500) {
    const id = Date.now() + Math.random();
    this._toasts.next([...this._toasts.value, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(msg: string) { this.add(msg, 'success'); }
  error(msg: string)   { this.add(msg, 'error', 6000); }
  warning(msg: string) { this.add(msg, 'warning'); }
  info(msg: string)    { this.add(msg, 'info'); }

  dismiss(id: number) {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }
}