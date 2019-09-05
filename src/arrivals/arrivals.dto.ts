import { IsString, IsUUID } from 'class-validator';

export class UpdateArrival {
  @IsString()
  @IsUUID()
  subscriptionId: string;
}
