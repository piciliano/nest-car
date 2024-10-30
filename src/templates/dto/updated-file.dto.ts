import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template.dto';

export class UpdateFileDto extends PartialType(CreateTemplateDto) {}
