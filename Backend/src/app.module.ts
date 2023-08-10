import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseModule} from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),

        UserModule,
        DatabaseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
