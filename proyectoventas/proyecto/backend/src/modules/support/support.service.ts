import { Injectable } from '@nestjs/common';

export type SupportReport = {
  id: string;
  listingId?: string;
  listingTitle?: string;
  text: string;
  reporterId?: string;
  status: 'open' | 'closed';
  createdAt: string;
};

@Injectable()
export class SupportService {
  private readonly reports: SupportReport[] = [];

  create(input: Omit<SupportReport, 'id' | 'status' | 'createdAt'>) {
    const report: SupportReport = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(report);
    return report;
  }

  findAll() {
    return this.reports;
  }

  close(id: string) {
    const report = this.reports.find((item) => item.id === id);
    if (report) report.status = 'closed';
    return report ?? { ok: false };
  }
}
