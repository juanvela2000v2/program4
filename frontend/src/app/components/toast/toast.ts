import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <div class="toast-wrap">
      <div *ngFor="let t of toastSvc.toasts$ | async"
           class="toast toast-{{t.type}}"
           (click)="toastSvc.dismiss(t.id)">
        <span class="t-icon">
          {{ t.type==='success' ? '✅' : t.type==='error' ? '❌' : t.type==='warning' ? '⚠️' : 'ℹ️' }}
        </span>
        <span class="t-msg">{{ t.message }}</span>
        <button class="t-close" (click)="toastSvc.dismiss(t.id)">✕</button>
      </div>
    </div>`,
  styles: [`
    .toast-wrap {
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      display: flex; flex-direction: column; gap: 10px; width: 360px;
    }
    .toast {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.35);
      cursor: pointer; animation: slideIn .35s cubic-bezier(.16,1,.3,1);
      border-left: 4px solid transparent;
    }
    @keyframes slideIn {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .toast-success { background:#052e16; color:#bbf7d0; border-color:#22c55e; }
    .toast-error   { background:#450a0a; color:#fecaca; border-color:#ef4444; }
    .toast-warning { background:#431407; color:#fed7aa; border-color:#f97316; }
    .toast-info    { background:#0c1a2e; color:#bfdbfe; border-color:#3b82f6; }
    .t-icon  { font-size: 18px; flex-shrink: 0; }
    .t-msg   { flex: 1; font-size: 14px; font-weight: 500; line-height: 1.4; }
    .t-close { background: none; border: none; color: inherit; font-size: 16px;
               cursor: pointer; opacity: .6; padding: 0 2px; flex-shrink: 0; }
    .t-close:hover { opacity: 1; }
  `]
})
export class ToastComponent {
  toastSvc = inject(ToastService);
}