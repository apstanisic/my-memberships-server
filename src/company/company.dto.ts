import { IsString, Length, IsIn, IsEmail, IsOptional } from 'class-validator';
import { companiesCategories, CompanyCategory } from './categories.list';

export class UpdateCompanyDto {
  /** Company name */
  @IsOptional()
  @IsString()
  @Length(6, 200)
  name: string;

  /** Company category */
  @IsOptional()
  @IsIn([...companiesCategories])
  category: CompanyCategory;

  /** Description of company, it's prices */
  @IsOptional()
  @IsString()
  @Length(4, 3000)
  description: string;

  /** Company's main phone numbers */
  @IsOptional()
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /** Company's main emails */
  @IsOptional()
  @IsEmail({}, { each: true })
  emails: string[];
}

export class CreateCompanyDto {
  /** Company name */
  @Length(6, 200)
  name: string;

  /** What type of business is this company. Must cloned because of readonly */
  @IsIn([...companiesCategories])
  category: CompanyCategory;

  /** Description of company, it's prices */
  @IsString()
  @Length(4, 3000)
  description: string;

  /** Company's main phone numbers */
  @IsString({ each: true })
  @Length(8, 30, { each: true })
  phoneNumbers: string[];

  /** Company's main emails */
  @IsEmail({}, { each: true })
  emails: string[];
}
