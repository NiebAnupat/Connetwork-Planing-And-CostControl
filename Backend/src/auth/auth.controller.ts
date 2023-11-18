import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SigninUserDto} from "./dto/signin-user-dto";
import {JwtToken} from "./jwt";
import {User} from "src/user/entities/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {

    }

    @Post('validate')
    async signin(@Body() user: SigninUserDto): Promise<JwtToken> {
        return await this.authService.validateUser(user.email, user.password);
    }

    @Get('validate-token')
    async validateToken(@Query('access_token') token: string): Promise<Partial<User>> {
        return await this.authService.validateUserByJwt({access_token: token});
    }


}
