import { Injectable, HttpException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Domain } from './schemas/domain.schema';
import axios from 'axios';


@Injectable()
export class DomainService {
  constructor(
    @InjectModel(Domain.name)
    private domainModel: Model<Domain>,
  ) {}

  async registerDomain(domainName: string, userId: string) {
    try {
      const res = await axios.post(
        'https://api.resend.com/domains',
        { name: domainName },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const { records, status, id } = res.data;

      const domain = new this.domainModel({
        name: domainName,
        userId,
        records,
        status,
        id,
      });

      await domain.save();

      return domain;
    } catch (error) {
      throw new HttpException(
        error?.response?.data || 'Resend error',
        error?.response?.status || 500,
      );
    }
  }

  async findAllByUser(userId: string) {
    return this.domainModel.find({ userId });
  }

  //   async refreshStatus(domainId: string) {
  //     try {
  //       // Step 1: Find domain in your DB
  //       const existing = await this.domainModel.findById(domainId);
  //       if (!existing || !existing.resendId) {
  //         throw new Error('Resend ID not found for this domain');
  //       }

  //       // Step 2: Use Resend's UUID (resendId) in API call
  //       const { data } = await axios.get(
  //         `https://api.resend.com/domains/${existing.resendId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //           },
  //         },
  //       );

  //       // Step 3: Update local DB with new status
  //       const updated = await this.domainModel.findByIdAndUpdate(
  //         domainId,
  //         { status: data.status },
  //         { new: true },
  //       );

  //       return updated;
  //     } catch (error) {
  //       console.error(
  //         '🔴 Error refreshing domain:',
  //         error?.response?.data || error,
  //       );
  //       throw new HttpException('Failed to refresh domain', 500);
  //     }
  //   }

  async getVerifiedResendDomain(userId: string) {
    try {
      const { data } = await axios.get('https://api.resend.com/domains', {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
      });

      const verified = data?.data?.find((d) => d.status === 'verified');

      if (!verified) {
        throw new HttpException('No verified domain found', 404);
      }

      // Check if domain already exists in DB
      const existing = await this.domainModel.findOne({ resendId: verified.id });

      if (!existing) {
        await this.domainModel.create({
          name: verified.name,
          status: verified.status,
          userId,
          resendId: verified.id,
          records: verified.records || [],
        });
      }

      return {
        id: verified.id,
        name: verified.name,
        status: verified.status,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch domain from Resend',
        error?.response?.status || 500,
      );
    }
  }

}
