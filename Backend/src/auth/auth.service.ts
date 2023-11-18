import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "src/user/user.service";
import {User} from "src/user/entities/user.entity";
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {JwtPayload, JwtToken} from "./jwt";
import {ObjectId as MongoObjectId} from "mongodb";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async validateUser(email: string, password: string): Promise<JwtToken> {
        const user: User = await this.userService.findOneByQuery({email});
        if (!user && !await bcrypt.compare(password, user.password)) throw new UnauthorizedException('Invalid credentials')

        const payload: JwtPayload = {
            sub: user._id,
            iat: Date.now(),
            email: user.email
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        }

    }

    async validateUserByJwt(token: JwtToken): Promise<Partial<User>> {
        const payload: JwtPayload = await this.jwtService.verifyAsync(token.access_token);
        return await this.userService.findOneByQuery({_id: new MongoObjectId(payload.sub)});
    }

    async signPayload(payload: JwtPayload): Promise<JwtToken> {
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
