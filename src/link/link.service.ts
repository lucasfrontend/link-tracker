import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkService {
  private links: Map<string, { url: string, redirectCount: number }> = new Map();

  createLink(url: string): string {
    const maskedUrl = this.generateMaskedUrl();
    this.links.set(maskedUrl, { url, redirectCount: 0 });
    return maskedUrl;
  }

  getOriginalUrl(maskedUrl: string): string {
    maskedUrl = 'http://localhost:8080/link/' + maskedUrl;
    const link = this.links.get(maskedUrl);
    return link ? link.url : null;
  }

  incrementRedirectCount(maskedUrl: string): void {
    const fullUrl = 'http://localhost:8080/link/' + maskedUrl;
    const link = this.links.get(fullUrl);
    console.log("link", link)
    if (link) {
      link.redirectCount++;
    }
  }

  getRedirectCount(maskedUrl: string): number {
    const fullUrl = 'http://localhost:8080/link/' + maskedUrl;
    const link = this.links.get(fullUrl);
    return link ? link.redirectCount : 0;
  }

  invalidateLink(maskedUrl: string): void {
    const fullUrl = 'http://localhost:8080/link/' + maskedUrl;
    this.links.delete(fullUrl);
  }

  private generateMaskedUrl(): string {
    return 'http://localhost:8080/link/' + Math.random().toString(36).substring(2, 10);
  }
}