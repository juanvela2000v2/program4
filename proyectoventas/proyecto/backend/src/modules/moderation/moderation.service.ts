import { Injectable } from '@nestjs/common';

const blockedTerms = ['sexo', 'sexual', 'pornografia', 'escort', 'desnudo', 'xxx'];

@Injectable()
export class ModerationService {
  private readonly alerts: Array<{
    id: string;
    title: string;
    description: string;
    reasons: string[];
    createdAt: string;
    resolved: boolean;
  }> = [];

  async checkListing(title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();
    const matches = blockedTerms.filter((term) => text.includes(term));
    const reasons = matches.length ? [`Contenido sexual o no permitido: ${matches.join(', ')}`] : [];

    if (reasons.length) {
      this.alerts.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        description,
        reasons,
        createdAt: new Date().toISOString(),
        resolved: false,
      });
    }

    return {
      approved: matches.length === 0,
      reasons,
      score: matches.length ? 0.92 : 0.02,
    };
  }

  findAlerts() {
    return this.alerts;
  }

  resolveAlert(id: string) {
    const alert = this.alerts.find((item) => item.id === id);
    if (alert) alert.resolved = true;
    return alert ?? { ok: false };
  }
}
