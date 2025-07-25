import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Domain extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  status: string; // e.g. "pending", "verified"

  @Prop({ type: [Object] })
  records: Record<string, any>[];

  @Prop()
  resendId: string;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
