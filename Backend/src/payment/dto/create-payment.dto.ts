import {IsNotEmpty, IsOptional} from "class-validator";
import {ObjectId} from "typeorm";

export class CreatePaymentDto {

    @IsNotEmpty()
    userId: ObjectId;

    @IsOptional()
    uid: string;

    @IsOptional()
    timestamp: string

    @IsNotEmpty()
    amount: number = 0

    @IsOptional()
    imagePath: string;

    @IsOptional()
    isVerified: boolean = false
}
