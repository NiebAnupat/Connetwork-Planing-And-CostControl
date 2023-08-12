import {forwardRef, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {DatabaseModule} from "src/database/database.module";
import {userProviders} from "./user.providers";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [forwardRef(() => AuthModule), DatabaseModule],
    controllers: [UserController],
    providers: [
        ...userProviders,
        UserService],
    exports: [UserService]
})
export class UserModule {
}
