import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TemplatesService } from "./templates.service";
import { CreateTemplateDto } from "./dto/create-template.dto";

@Controller('upload-template')
export class templateController {
    constructor(
        private templateService: TemplatesService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('template'))
    async uploadTemplate(
        @UploadedFile(
            new ParseFilePipe({
               validators: [
                new MaxFileSizeValidator({
                    maxSize: 1024 * 1024 * 5 // 5mb
                }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)'})
               ]
            })
        ) file: Express.Multer.File,
        @Body()
        createTemplateDto: CreateTemplateDto
    ) {

        return this.templateService.create(file, createTemplateDto)
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 0 ? limit : 1
        
        return this.templateService.findAll(page, limit)
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.templateService.findOne(id)
    }

    @Patch(':id')
    async updated(
        @Param('id') id: string,
        @Body() createTemplateDto: CreateTemplateDto
    ){
        return this.templateService.update(id, createTemplateDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.templateService.remove(id)
    }
}