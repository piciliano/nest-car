import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Templates } from 'src/database/entities/file.entity';
import { Repository } from 'typeorm';
import * as path from 'node:path';
import { promises as fsPromises } from 'node:fs';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Templates)
    private templateRepository: Repository<Templates>,
  ) {}

  async create(
    file: Express.Multer.File,
    createTemplateDto: CreateTemplateDto,
  ) {
    try {
      const fileName = `${createTemplateDto.templateName}.${file.mimetype.split('/')[1]}`;

      await this.findByName(fileName);

      const uploadDir = path.resolve(process.cwd(), 'uploads');

      await fsPromises.mkdir(uploadDir, { recursive: true });

      const uploadPath = path.join(uploadDir, fileName);

      await fsPromises.writeFile(uploadPath, file.buffer);

      const uploadSave = this.templateRepository.create({
        templateName: fileName,
        link: uploadPath,
      });

      await this.templateRepository.save(uploadSave);

      return {
        uploadSave,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async findAll(page: number, limit: number) {
    try {

      const [templates, total] = await this.templateRepository.findAndCount({
        skip: (page -1) * limit,
        take: limit
      })

      return {
        data: templates,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const template = await this.templateRepository.findOne({
        where: { id },
      });

      if (!template) {
        throw new NotFoundException();
      }

      return template;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async findByName(templateName: string) {
    try {
      const templatesIsExist = await this.templateRepository.findOne({
        where: {
          templateName,
        },
      });

      if (templatesIsExist) {
        throw new ConflictException();
      }

      return templatesIsExist;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async update(id: string, createTemplateDto: CreateTemplateDto) {
    try {
      const template = await this.findOne(id);

      const templateAffected = this.templateRepository.merge(
        template,
        createTemplateDto,
      );

      return await this.templateRepository.save(templateAffected);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }

  async remove(id: string) {
    try {
      const { link } = await this.findOne(id);

      await fsPromises.unlink(link);

      await this.templateRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || 500,
      );
    }
  }
}
