import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaoign.dto';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';

@Controller('campaign')
@UseGuards(ClerkAuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.campaignService.create(dto, userId);
  }

  @Get('summary')
  async getCampaignSummaries(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.campaignService.getSummaries(userId);
  }
}
