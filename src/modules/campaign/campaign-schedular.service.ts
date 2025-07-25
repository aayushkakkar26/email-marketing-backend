import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { Campaign } from './schemas/campaign.schema';
import { Contact } from '../contact/schemas/contact.schema';
import { Resend } from 'resend';

@Injectable()
export class CampaignSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(CampaignSchedulerService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  onModuleInit() {
    this.scheduleCampaigns();
  }

  // scheduleCampaigns() {
  //   cron.schedule('* * * * *', async () => {
  //     this.logger.log('⏳ Running campaign email scheduler');

  //     const campaigns = await this.campaignModel.find({ status: 'scheduled' });

  //     for (const campaign of campaigns) {
  //       for (const email of campaign.recipients) {
  //         const contact = await this.contactModel.findOne({ email });
  //         if (!contact) continue;

  //         const firstStep = campaign.steps[0];
  //         const personalizedBody = firstStep.body.replace(/{{firstName}}/g, contact.firstName || '');

  //         try {
  //           const result = await this.resend.emails.send({
  //             from: campaign.senderEmail, //onboarding@resend.dev
  //             to: email, // aayushkakkar90@gmail.com
  //             subject: firstStep.subject,
  //             html: personalizedBody,
  //           });
  //           campaign.emailsSent += 1;
  //           this.logger.log(`✅ Sent to ${email}, result: ${JSON.stringify(result)}`);
  //         } catch (error) {
  //           this.logger.error(`❌ Failed to send to ${email}`, error);
  //         }
  //       }

  //       campaign.status = 'sent';
  //       await campaign.save();
  //     }
  //   });
  // }

  scheduleCampaigns() {
    cron.schedule('* * * * *', async () => {
      this.logger.log('⏳ Running campaign email scheduler');

      const campaigns = await this.campaignModel.find({ status: 'scheduled' });

      for (const campaign of campaigns) {
        campaign.status = 'processing';
        await campaign.save();

        const totalSteps = campaign.steps.length;
        const totalRecipients = campaign.recipients.length;
        const totalEmails = totalSteps * totalRecipients;

        let emailsSentCount = 0;

        for (const email of campaign.recipients) {
          const contact = await this.contactModel.findOne({ email });
          if (!contact) continue;

          for (const step of campaign.steps) {
            const delayInMs = step.delay * 60 * 60 * 1000;

            setTimeout(async () => {
              const personalizedBody = step.body.replace(
                /{{firstName}}/g,
                contact.firstName || '',
              );

              try {
                const result = await this.resend.emails.send({
                  from: campaign.senderEmail,
                  to: email,
                  subject: step.subject,
                  html: personalizedBody,
                });

                // ✅ Create a fresh instance from the campaign doc
                const freshCampaign = await this.campaignModel.findById(
                  campaign._id,
                );
                if (!freshCampaign) return;

                freshCampaign.emailsSent += 1;
                emailsSentCount += 1;

                this.logger.log(
                  `✅ Sent to ${email} | Step: ${step.subject} | Result: ${JSON.stringify(result)}`,
                );

                if (emailsSentCount === totalEmails) {
                  freshCampaign.status = 'sent';
                  this.logger.log(
                    `📬 Campaign ${freshCampaign._id} completed and marked as 'sent'`,
                  );
                }

                await freshCampaign.save(); // Only this instance is saved
              } catch (error) {
                this.logger.error(
                  `❌ Failed to send to ${email} for step "${step.subject}"`,
                  error,
                );
              }
            }, delayInMs);
          }
        }
      }
    });
  }
}
