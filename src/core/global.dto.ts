import { IsUUID } from 'class-validator';

/* Valid uuid string */
export class IdParam {
  @IsUUID()
  id: string;
}
