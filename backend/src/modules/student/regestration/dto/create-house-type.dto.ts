import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateHouseTypeDto {
    @IsBoolean()
    @IsNotEmpty()
    meals: boolean;

    @IsString()
    @IsNotEmpty()
    housing_type: string;
}