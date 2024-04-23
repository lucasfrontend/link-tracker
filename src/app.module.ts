import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkService } from './link/link.service';
import { LinkController } from './link/link.controller';

@Module({
  imports: [],
  controllers: [AppController, LinkController],
  providers: [AppService, LinkService],
})
export class AppModule {}
