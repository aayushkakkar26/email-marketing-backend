import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaoign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
  ) {}

  async create(dto: CreateCampaignDto, userId: string) {
    const campaign = new this.campaignModel({ ...dto, userId });
    return campaign.save();
  }
  async getSummaries(userId: string) {
    return this.campaignModel
      .find({ userId })
      .select('name status openRate steps recipients createdAt emailsSent senderEmail');
  }
}
