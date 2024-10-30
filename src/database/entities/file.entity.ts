import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Templates {
    @PrimaryGeneratedColumn('uuid')
    id:  string;

    @Column()
    templateName: string;

    @Column()
    link: string;
}