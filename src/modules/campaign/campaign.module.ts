import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { AuthModule } from '../auth/auth.module';
import { CampaignSchedulerService } from './campaign-schedular.service';
import { ContactModule } from '../contact/contact.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    AuthModule,
    ContactModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignSchedulerService],
})
export class CampaignModule {}
