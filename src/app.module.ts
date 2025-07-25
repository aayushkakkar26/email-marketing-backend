import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { DomainModule } from './modules/domain/domain.module';
import { ContactModule } from './modules/contact/contact.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { SenderModule } from './modules/sender/sender.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    DomainModule,
    ContactModule,
    CampaignModule,
    SenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
