import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Req,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contact')
@UseGuards(ClerkAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getContacts(@Req() req: Request) {
    const userId = (req as any).user.id; // get user from token
    return this.contactService.findAllByUser(userId);
  }
  @Post()
  async addContact(@Req() req: Request, @Body() body: any) {
    const userId = (req as any).user.id;
    const { email, firstName } = body;

    return this.contactService.create({ email, firstName, userId });
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(@Req() req: Request, @UploadedFile() file: any) {
    const userId = (req as any).user.id;
    return this.contactService.parseAndSaveCSV(file.buffer, userId);
  }
  @Delete(':id')
  async deleteContact(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.contactService.deleteContact(id, userId);
  }
}
