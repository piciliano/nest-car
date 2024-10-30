import { IsNotEmpty, IsString } from "class-validator";

export class CreateCarDto {

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsString()
    model: string;
}
