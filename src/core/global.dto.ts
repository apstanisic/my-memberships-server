import { IsString, IsOptional, IsNumberString, IsUUID } from 'class-validator';

/* Valid uuid string */
export class IdParam {
  @IsString()
  @IsUUID()
  id: string;
}

/* Valid page for pagination */
export class PageParam {
  @IsOptional()
  @IsNumberString()
  page: string = '1';
}
