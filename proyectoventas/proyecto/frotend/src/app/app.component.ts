import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BadgeCheck,
  Building2,
  CreditCard,
  Home,
  LucideAngularModule,
  MessageCircle,
  Search,
  ShieldCheck,
} from 'lucide-angular';
import { io } from 'socket.io-client';
import { ApiService, Listing } from './api.service';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth.component';
import { AuthModalComponent } from './auth-modal.component';
import { PublishModalComponent } from './publish-listing.component';
import { AdminPanelComponent } from './admin-panel.component';
import { TransferPaymentComponent } from './transfer-payment.component';

type ChatMessage = { from: string; text: string; createdAt: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    LucideAngularModule,
    AuthComponent,
    AuthModalComponent,
    PublishModalComponent,
    AdminPanelComponent,
    TransferPaymentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly icons = { Search, Home, Building2, CreditCard, MessageCircle, ShieldCheck, BadgeCheck };
  readonly categories = [
    { label: 'Todo', value: '' },
    { label: 'Trabajos', value: 'job' },
    { label: 'Ventas', value: 'real_estate_sale' },
    { label: 'Alquileres', value: 'rent' },
    { label: 'Anticreticos', value: 'anticretico' },
    { label: 'Bienes', value: 'product' },
  ];
  readonly typeLabels: Record<string, string> = {
    job: 'Trabajo',
    real_estate_sale: 'Venta',
    rent: 'Alquiler',
    anticretico: 'Anticretico',
    product: 'Bien',
    service: 'Servicio',
  };
  readonly paymentMethods = ['QR Banco', 'Transferencia', 'Tarjeta'];
  readonly selectedListing = signal<Listing | null>(null);
  readonly selectedPaymentMethod = signal('');
  readonly qr = signal<{ id: string; src: string; payload: string; fee: number; percent: number; paid: boolean; webhookSent?: boolean } | null>(null);
  readonly supportOpen = signal(true);
  readonly messages = signal<ChatMessage[]>([]);
  readonly supportText = signal('');
  readonly reportListing = signal<Listing | null>(null);
  readonly reportText = signal('');
  readonly reportStatus = signal('');
  readonly editListing = signal<Listing | null>(null);
  readonly editForm = signal({ title: '', description: '', price: 0, location: '' });
  readonly currentHash = signal(window.location.hash || '#avisos');
  readonly showAuthModal = signal(false);
  readonly showPublishModal = signal(false);
  readonly pageSubtitle = computed(() => `${this.api.filteredCount()} avisos disponibles`);
  readonly isAdminPage = computed(() => this.currentHash() === '#admin');
  private readonly socket = io('http://localhost:3000', { withCredentials: true });

  constructor(
    readonly api: ApiService,
    readonly authService: AuthService,
  ) {}

  deleteListing(listing: Listing) {
    if (!confirm('Eliminar este anuncio? Esta acción no se puede deshacer.')) return;
    this.api.deleteListing(listing.id).subscribe({
      next: () => {
        this.api.listings.set(this.api.listings().filter((l) => l.id !== listing.id));
      },
      error: (err) => {
        console.error('Delete error', err);
        alert(err.error?.message || 'Error al eliminar el anuncio');
      },
    });
  }

  canDelete(listing: Listing) {
    const user = this.authService.currentUser();
    return !!user && (this.authService.hasRole('admin') || user.id === listing.ownerId);
  }

  canEdit(listing: Listing) {
    const user = this.authService.currentUser();
    return !!user && user.id === listing.ownerId;
  }

  ngOnInit() {
    this.api.search();
    this.socket.emit('support:join', { roomId: 'denuncias-publicas' });
    this.socket.on('support:message', (message: ChatMessage) => this.messages.update((items) => [...items, message]));
  }

  @HostListener('window:hashchange')
  onHashChange() {
    this.currentHash.set(window.location.hash || '#avisos');
  }

  search() {
    this.api.search();
  }

  selectCategory(value: string) {
    this.api.category.set(value);
    this.api.search();
  }

  listingTypeLabel(type: string) {
    return this.typeLabels[type] ?? type;
  }

  choosePayment(listing: Listing, method: string) {
    if (!this.authService.isAuthenticated()) {
      this.showAuthModal.set(true);
      return;
    }
    this.selectedListing.set(listing);
    this.selectedPaymentMethod.set(method);
    if (method === 'Transferencia') {
      this.qr.set(null);
      return;
    }
    this.api.createQr(listing, method).subscribe({
      next: (payment) =>
        this.qr.set({
          id: payment.id,
          src: payment.qrDataUrl,
          payload: payment.qrPayload,
          fee: payment.platformFee,
          percent: payment.commissionPercent,
          paid: false,
        }),
      error: () =>
        this.qr.set({
          id: '',
          src: '',
          payload: `0002010102122600BUSCAYA-BOLIVIA5204000053030685405${Number(listing.price).toFixed(2)}`,
          fee: Number((listing.price * 0.03).toFixed(2)),
          percent: 3,
          paid: false,
        }),
    });
  }

  simulatePayment() {
    const payment = this.qr();
    if (!payment?.id) {
      this.qr.update((item) => (item ? { ...item, paid: true } : item));
      return;
    }
    this.api.simulatePaid(payment.id).subscribe({
      next: (response: any) => {
        this.qr.update((item) => (item ? { ...item, paid: true, webhookSent: Boolean(response?.webhookSent) } : item));
      },
      error: () => this.qr.update((item) => (item ? { ...item, paid: true } : item)),
    });
  }

  sendSupport() {
    const text = this.supportText().trim();
    if (!text) return;
    this.socket.emit('support:message', { roomId: 'denuncias-publicas', text });
    this.supportText.set('');
  }

  openReport(listing: Listing) {
    if (!this.authService.isAuthenticated()) {
      this.showAuthModal.set(true);
      return;
    }
    this.reportListing.set(listing);
    this.reportText.set('');
    this.reportStatus.set('');
  }

  sendReport() {
    const listing = this.reportListing();
    const text = this.reportText().trim();
    if (!listing || !text) return;
    this.api.createReport({ listingId: listing.id, listingTitle: listing.title, text }).subscribe({
      next: () => {
        this.reportStatus.set('Denuncia enviada a soporte.');
      },
      error: () => this.reportStatus.set('No se pudo enviar la denuncia.'),
    });
  }

  openEdit(listing: Listing) {
    if (!this.canEdit(listing)) return;
    this.editListing.set(listing);
    this.editForm.set({
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      location: listing.location,
    });
  }

  updateEditField(field: 'title' | 'description' | 'price' | 'location', value: string | number) {
    this.editForm.update((form) => ({
      ...form,
      [field]: field === 'price' ? Number(value) : value,
    }));
  }

  saveEdit() {
    const listing = this.editListing();
    if (!listing) return;
    this.api.updateListing(listing.id, this.editForm()).subscribe({
      next: (updated) => {
        this.api.listings.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
        this.editListing.set(null);
      },
      error: (err) => alert(err.error?.message || 'No se pudo editar la publicacion'),
    });
  }
}
