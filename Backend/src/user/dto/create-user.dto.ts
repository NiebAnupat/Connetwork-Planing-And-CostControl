import {IsArray, IsBoolean, IsEmail, IsHash, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ObjectId} from "typeorm";

export class CreateUserDto {

    @IsOptional()
    _id: ObjectId;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email is not valid'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be string'})
    password: string;

    @IsNotEmpty({message: 'Username is required'})
    @IsString({message: 'Username must be string'})
    username: string;

    @IsOptional()
    @IsString({message: 'Role must be string'})
    role: string = 'user';


    @IsOptional()
    @Transform(({value}) => value === 'true')
    @IsBoolean({message: 'isFreeTrial must be boolean'})
    isFreeTrial: boolean = false;

    @IsOptional()
    @Transform(({value}) => Number(value))
    @IsInt({message: 'dateRemaining must be integer'})
    dateRemaining: number = 0;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    @IsBoolean({message: 'isDeleted must be boolean'})
    isDeleted: boolean = false;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    @IsBoolean({message: 'isVerified must be boolean'})
    isVerified: boolean = false;

    @IsOptional()
    @IsArray({message: 'productData must be array'})
    productData: any[] = [];


}
