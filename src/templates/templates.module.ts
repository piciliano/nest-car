import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Templates } from "src/database/entities/file.entity";
import { TemplatesService } from "./templates.service";
import { templateController } from "./templates.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Templates])],
    controllers: [templateController],
    providers: [TemplatesService]
})

export class TemplatesModule {}