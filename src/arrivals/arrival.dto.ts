import { UUID } from 'nestjs-extra';
import { IsUUID } from 'class-validator';

export class CreateArrivalDto {
  @IsUUID()
  locationId: UUID;

  @IsUUID()
  userId: UUID;
}
