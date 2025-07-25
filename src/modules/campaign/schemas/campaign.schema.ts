// src/modules/campaign/schemas/campaign.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// @Schema({ timestamps: true })
// export class Campaign extends Document {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   subject: string;

//   @Prop({ required: true })
//   body: string;

//   @Prop({ required: true })
//   senderEmail: string;

//   @Prop({ required: true })
//   recipients: string[]; // array of emails

//   @Prop({ required: true })
//   userId: string;

//   @Prop({ default: 'draft' }) // status can be: draft, scheduled, sent
//   status: string;

//   @Prop({ default: 0 })
//   openRate: number;
// }

@Schema({ timestamps: true })
export class Campaign extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [
      {
        subject: { type: String, required: true },
        body: { type: String, required: true },
        delay: { type: Number, required: true }, // in hours/days
      },
    ],
    required: true,
  })
  steps: {
    subject: string;
    body: string;
    delay: number;
  }[];

  @Prop({ required: true })
  senderEmail: string;

  @Prop({ required: true })
  recipients: string[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'draft' })
  status: string;

  @Prop({ default: 0 })
  openRate: number;

  @Prop({ default: 0 })
  emailsSent: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
