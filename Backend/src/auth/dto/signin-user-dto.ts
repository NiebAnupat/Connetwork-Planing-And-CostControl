import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class SigninUserDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email is not valid'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be string'})
    password: string;
}
