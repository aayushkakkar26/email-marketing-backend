import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sender extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: "active" }) // or "blocked", "pending"
  status: string;
}

export const SenderSchema = SchemaFactory.createForClass(Sender);
