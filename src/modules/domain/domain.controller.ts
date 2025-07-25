import {
  Controller,
  Body,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { DomainService } from './domain.service';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';

@Controller('domain')
@UseGuards(ClerkAuthGuard)
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Post()
  async create(@Body('name') name: string, @Req() req: any) {
    return this.domainService.registerDomain(name, req.user.id);
  }

  @Get()
  async getDomains(@Req() req: any) {
    return this.domainService.findAllByUser(req.user.id);
  }

  @Get('verified-resend')
  async getVerified(@Req() req: any) {
    const userId = req.user.id;
    return this.domainService.getVerifiedResendDomain(userId);
  }
}
