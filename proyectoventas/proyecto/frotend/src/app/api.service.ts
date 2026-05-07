import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';

export type Listing = {
  id: string;
  title: string;
  description: string;
  contactName?: string;
  contactPhone?: string;
  type: string;
  price: number;
  currency: string;
  location: string;
  imageUrl?: string;
  ownerId?: string;
  status?: string;
  moderation?: { approved: boolean; reasons: string[]; score: number };
};

export type PaymentSummary = {
  count: number;
  totalSales: number;
  totalProfit: number;
  payments: Array<{
    id: string;
    listingId: string;
    amount: number;
    platformFee: number;
    commissionPercent: number;
    method: string;
    status: string;
    createdAt: string;
  }>;
};

export type ModerationAlert = {
  id: string;
  title: string;
  description: string;
  reasons: string[];
  createdAt: string;
  resolved: boolean;
};

export type SupportReport = {
  id: string;
  listingId?: string;
  listingTitle?: string;
  text: string;
  reporterId?: string;
  status: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';
  readonly listings = signal<Listing[]>([]);
  readonly query = signal('');
  readonly category = signal('');
  readonly loading = signal(false);
  readonly filteredCount = computed(() => this.listings().length);

  constructor(private readonly http: HttpClient) {}

  search() {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.query()) params['q'] = this.query();
    if (this.category()) params['type'] = this.category();
    this.http.get<Listing[]>(`${this.baseUrl}/listings`, { params, withCredentials: true }).subscribe({
      next: (items) => {
        this.listings.set(items.length ? items : sampleListings);
        this.loading.set(false);
      },
      error: () => {
        this.listings.set(sampleListings);
        this.loading.set(false);
      },
    });
  }

  createQr(listing: Listing, method: string) {
    return this.createPayment(listing, method);
  }

  createPayment(listing: Listing, method: string) {
    return this.http.post<{ id: string; qrDataUrl: string; qrPayload: string; platformFee: number; commissionPercent: number; status: string }>(
      `${this.baseUrl}/payments/qr`,
      { listingId: listing.id, amount: Math.max(1, Number(listing.price) || 0), method },
      { withCredentials: true },
    );
  }

  simulatePaid(paymentId: string) {
    return this.http.patch(
      `${this.baseUrl}/payments/${paymentId}/simulate-paid`,
      {},
      { withCredentials: true },
    );
  }

  adminListings() {
    return this.http.get<Listing[]>(`${this.baseUrl}/listings/admin/all`, { withCredentials: true });
  }

  adminPayments() {
    return this.http.get<PaymentSummary>(`${this.baseUrl}/payments/admin/summary`, { withCredentials: true });
  }

  moderationAlerts() {
    return this.http.get<ModerationAlert[]>(`${this.baseUrl}/moderation/alerts`, { withCredentials: true });
  }

  resolveModerationAlert(id: string) {
    return this.http.patch(`${this.baseUrl}/moderation/alerts/${id}/resolve`, {}, { withCredentials: true });
  }

  createReport(payload: { listingId?: string; listingTitle?: string; text: string }) {
    return this.http.post<SupportReport>(`${this.baseUrl}/support/reports`, payload, { withCredentials: true });
  }

  supportReports() {
    return this.http.get<SupportReport[]>(`${this.baseUrl}/support/reports`, { withCredentials: true });
  }

  closeReport(id: string) {
    return this.http.patch(`${this.baseUrl}/support/reports/${id}/close`, {}, { withCredentials: true });
  }

  deleteListing(id: string) {
    return this.http.delete(`${this.baseUrl}/listings/${id}`, { withCredentials: true });
  }

  updateListing(id: string, payload: Partial<Listing>) {
    return this.http.patch<Listing>(`${this.baseUrl}/listings/${id}`, payload, { withCredentials: true });
  }

  moderate(title: string, description: string) {
    return this.http.post<{ approved: boolean; reasons: string[]; score: number }>(
      `${this.baseUrl}/moderation/check`,
      { title, description },
    );
  }
}

export const sampleListings: Listing[] = [
  {
    id: 'demo-1',
    title: 'Departamento soleado en anticretico',
    description: 'Tres dormitorios, cocina americana, cerca de transporte publico.',
    type: 'anticretico',
    price: 28000,
    currency: 'USD',
    location: 'La Paz',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'demo-2',
    title: 'Ejecutivo comercial para inmobiliaria',
    description: 'Trabajo fijo con comisiones, manejo de clientes y publicaciones.',
    type: 'job',
    price: 3500,
    currency: 'BOB',
    location: 'Santa Cruz',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'demo-3',
    title: 'Casa familiar en venta',
    description: 'Amplio jardin, garaje doble y documentacion al dia.',
    type: 'real_estate_sale',
    price: 145000,
    currency: 'USD',
    location: 'Cochabamba',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
  },
];
