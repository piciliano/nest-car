import { IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  templateName: string;
}
