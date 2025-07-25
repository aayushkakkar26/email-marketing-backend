export class StepDto {
  subject: string;
  body: string;
  delay: number;
}

export class CreateCampaignDto {
  name: string;
  senderEmail: string;
  recipients: string[];
  userId: string;
  steps: StepDto[];
}