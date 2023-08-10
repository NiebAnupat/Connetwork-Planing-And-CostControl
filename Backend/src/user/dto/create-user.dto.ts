import {IsBoolean, IsEmail, IsHash, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreateUserDto {

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email is not valid'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsHash('sha256', {message: 'Password must be hashed'})
    password: string;

    @IsNotEmpty({message: 'Username is required'})
    @IsString({message: 'Username must be string'})
    username: string;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    @IsBoolean({message: 'isFreeTrial must be boolean'})
    isFreeTrial: boolean = false;

    @IsOptional()
    @Transform(({value}) => Number(value))
    @IsInt({message: 'dateRemaining must be integer'})
    dateRemaining: number = 0;

}
