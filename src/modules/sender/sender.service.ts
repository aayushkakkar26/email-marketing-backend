import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Sender } from './schemas/sender.schema';
import { Domain } from '../domain/schemas/domain.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SenderService {
  constructor(
    @InjectModel(Sender.name) private senderModel: Model<Sender>,
    @InjectModel(Domain.name) private domainModel: Model<Domain>, // to verify domain
  ) {}

  async addSender(email: string, userId: string) {
    const domain = email.split('@')[1];

    const verified = await this.domainModel.findOne({
      name: domain,
      userId,
      status: 'verified',
    });

    if (!verified) {
      throw new BadRequestException('Domain not verified');
    }

    const sender = new this.senderModel({ email, domain, userId });
    return sender.save();
  }

  async getSendersByUser(userId: string) {
    return this.senderModel.find({ userId });
  }

  async deleteSender(id: string, userId: string) {
    const sender = await this.senderModel.findOneAndDelete({ _id: id, userId });

    if (!sender) {
      throw new NotFoundException('Sender not found or unauthorized');
    }

    return { message: 'Sender deleted successfully' };
  }
}
