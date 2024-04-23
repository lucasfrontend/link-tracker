import { Controller, Get, Post, Param, Put, Res, HttpStatus, Body, Query, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post('create')
  async createLink(@Body() body: { url: string }): Promise<{ target: string, link: string, valid: boolean }> {
    const { url } = body;
    const maskedUrl = await this.linkService.createLink(url);
    return { target: url, link: maskedUrl, valid: true };
  }

  // Ejemplo: http://localhost:8080/link/1vbqxklt?password=123&expirationDate=2024-12-31
  @Get(':maskedUrl')
  async redirect(
    @Param('maskedUrl') maskedUrl: string,
    @Query('password') password: string,
    @Query('expirationDate') expirationDate: string,
    @Res() res: Response
  ) {
      const originalUrl = this.linkService.getOriginalUrl(maskedUrl);
      console.log("originalUrl", originalUrl)
      if (expirationDate) {
        const expirationDateTime = new Date(expirationDate);
        if (isNaN(expirationDateTime.getTime())) {
          throw new NotFoundException('Fecha de expiración inválida');
        }

        if (expirationDateTime <= new Date()) {
          throw new NotFoundException('El enlace ha expirado');
        }
      }

      if (originalUrl) {
        this.linkService.incrementRedirectCount(maskedUrl);
        res.status(HttpStatus.FOUND).redirect(originalUrl);
      } else {
        throw new NotFoundException('URL enmascarada no válida');
      }
  }

  @Get(':maskedUrl/stats')
  getLinkStats(@Param('maskedUrl') maskedUrl: string): { redirectCount: number } {
    const redirectCount = this.linkService.getRedirectCount(maskedUrl);
    return { redirectCount };
  }

  @Put(':maskedUrl')
  invalidateLink(@Param('maskedUrl') maskedUrl: string): void {
    this.linkService.invalidateLink(maskedUrl);
  }
}