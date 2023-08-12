import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "src/user/user.module";
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                isGlobal: true,
                secret: configService.get('SECRET_KEY'),
                signOptions: {expiresIn: '30d'}
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {
}
