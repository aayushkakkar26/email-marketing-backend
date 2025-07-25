import { Controller, Post, Get, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { SenderService } from './sender.service';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';

@Controller('sender')
@UseGuards(ClerkAuthGuard)
export class SenderController {
  constructor(private senderService: SenderService) {}

  @Post()
  async addSender(@Req() req, @Body('email') email: string) {
    return this.senderService.addSender(email, req.user.id);
  }

  @Get()
  async getSenders(@Req() req) {
    return this.senderService.getSendersByUser(req.user.id);
  }

  @Delete(':id')
  async deleteSender(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.senderService.deleteSender(id, userId);
  }
}
