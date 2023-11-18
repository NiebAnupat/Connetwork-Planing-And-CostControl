import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from "./user/user.module";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from './database/database.module';
import {AuthModule} from './auth/auth.module';
import {PaymentModule} from "./payment/payment.module";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {CloudStorageModule} from './cloud-storage/cloud-storage.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.storage'],
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
        PaymentModule,
        CloudStorageModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
