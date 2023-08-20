import {IsNotEmpty, IsOptional} from "class-validator";
import {ObjectId} from "typeorm";
import {Transform} from "class-transformer";

export class CreatePaymentDto {

    @IsNotEmpty()
    userId: ObjectId;

    @IsOptional()
    payId: string;

    @IsOptional()
    timestamp: string

    @IsNotEmpty()
    @Transform(({value}) => Number(value))
    amount: number

    @IsOptional()
    filename: string;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    isVerified: boolean
}
