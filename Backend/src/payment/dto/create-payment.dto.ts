import {IsNotEmpty, IsOptional} from "class-validator";
import {ObjectId} from "typeorm";
import {Transform} from "class-transformer";

export class CreatePaymentDto {

    @IsNotEmpty()
    userId: ObjectId;

    @IsOptional()
    mediaId: string;

    @IsOptional()
    timestamp: string

    @IsNotEmpty()
    amount: number

    @IsOptional()
    filename: string;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    isVerified: boolean
}
