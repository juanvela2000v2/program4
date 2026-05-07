import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Listing } from './api.service';

type TransferReceipt = {
  id: string;
  listingTitle: string;
  amount: number;
  bank: string;
  accountName: string;
  accountNumber: string;
  reference: string;
  createdAt: string;
};

@Component({
  selector: 'app-transfer-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './transfer-payment.component.html',
  styleUrl: './transfer-payment.component.css',
})
export class TransferPaymentComponent {
  @Input() listing: Listing | null = null;

  readonly form = signal({ bank: '', accountName: '', accountNumber: '', reference: '', amount: 0 });
  readonly status = signal('');
  readonly receipt = signal<TransferReceipt | null>(null);
  readonly paid = signal(false);

  constructor(private readonly api: ApiService) {}

  ngOnChanges() {
    this.form.set({
      bank: '',
      accountName: '',
      accountNumber: '',
      reference: '',
      amount: Number(this.listing?.price) || 0,
    });
    this.status.set('');
    this.receipt.set(null);
    this.paid.set(false);
  }

  updateField(field: 'bank' | 'accountName' | 'accountNumber' | 'reference' | 'amount', value: string | number) {
    this.form.update((form) => ({ ...form, [field]: field === 'amount' ? Number(value) : value }));
  }

  submit() {
    const listing = this.listing;
    const form = this.form();
    if (!listing) return;
    if (!form.bank.trim() || !form.accountName.trim() || !form.accountNumber.trim()) {
      this.status.set('Completa banco, titular y numero de cuenta.');
      return;
    }
    if (!form.amount || form.amount <= 0) {
      this.status.set('Ingresa un monto valido.');
      return;
    }

    this.status.set('Registrando transferencia...');
    this.api.createPayment({ ...listing, price: form.amount }, 'Transferencia').subscribe({
      next: (payment) => this.confirmPayment(payment.id, listing, form),
      error: () => this.status.set('No se pudo registrar la transferencia.'),
    });
  }

  private confirmPayment(paymentId: string, listing: Listing, form: ReturnType<typeof this.form>) {
    this.api.simulatePaid(paymentId).subscribe({
      next: (response: any) => {
        this.paid.set(true);
        this.receipt.set({
          id: response?.webhookPayload?.id_transaccion || paymentId,
          listingTitle: listing.title,
          amount: form.amount,
          bank: form.bank,
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          reference: form.reference,
          createdAt: new Date().toISOString(),
        });
        this.status.set('Transferencia pagada. Comprobante generado.');
      },
      error: () => this.status.set('No se pudo confirmar la transferencia.'),
    });
  }
}
