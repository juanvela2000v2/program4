import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertTriangle, BarChart3, LucideAngularModule, Trash2 } from 'lucide-angular';
import { ApiService, Listing, ModerationAlert, PaymentSummary, SupportReport } from './api.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, LucideAngularModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  readonly icons = { AlertTriangle, BarChart3, Trash2 };
  readonly adminListings = signal<Listing[]>([]);
  readonly adminPayments = signal<PaymentSummary | null>(null);
  readonly moderationAlerts = signal<ModerationAlert[]>([]);
  readonly supportReports = signal<SupportReport[]>([]);

  constructor(
    readonly api: ApiService,
    readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.authService.hasRole('admin')) {
      this.refreshAdminListings();
      this.refreshAdminPayments();
      this.refreshModerationAlerts();
    }
    if (this.authService.hasRole('support') || this.authService.hasRole('admin')) {
      this.refreshSupportReports();
    }
  }

  refreshAdminListings() {
    this.api.adminListings().subscribe({ next: (items) => this.adminListings.set(items), error: () => this.adminListings.set([]) });
  }

  refreshAdminPayments() {
    this.api.adminPayments().subscribe({ next: (summary) => this.adminPayments.set(summary), error: () => this.adminPayments.set(null) });
  }

  refreshModerationAlerts() {
    this.api.moderationAlerts().subscribe({ next: (alerts) => this.moderationAlerts.set(alerts), error: () => this.moderationAlerts.set([]) });
  }

  refreshSupportReports() {
    this.api.supportReports().subscribe({ next: (reports) => this.supportReports.set(reports), error: () => this.supportReports.set([]) });
  }

  deleteListing(listing: Listing) {
    if (!confirm('Eliminar este anuncio? Esta accion no se puede deshacer.')) return;
    this.api.deleteListing(listing.id).subscribe({
      next: () => this.adminListings.set(this.adminListings().filter((item) => item.id !== listing.id)),
      error: (err) => alert(err.error?.message || 'Error al eliminar el anuncio'),
    });
  }

  resolveAlert(id: string) {
    this.api.resolveModerationAlert(id).subscribe({ next: () => this.refreshModerationAlerts() });
  }

  closeReport(id: string) {
    this.api.closeReport(id).subscribe({ next: () => this.refreshSupportReports() });
  }
}
