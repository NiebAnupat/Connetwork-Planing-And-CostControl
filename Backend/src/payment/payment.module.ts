import {BadRequestException, Module} from '@nestjs/common';
import {PaymentService} from './payment.service';
import {PaymentController} from './payment.controller';
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {existsSync, mkdirSync} from 'fs';
import * as path from "path";

@Module({
    imports: [
        MulterModule.register({
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = ["image/jpeg", "image/png"];
                const mimetAypeIsValid = allowedMimeTypes.includes(file.mimetype);
                const extensionIsValid = [".jpg", ".jpeg", ".png", ".JPG"].some((ext) =>
                    file.originalname.endsWith(ext)
                );
                if (mimetAypeIsValid && extensionIsValid) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException("Please upload an image file (jpg, jpeg, png, gif)."), false);
                }
            },
            // dest: './public/upload',
            storage: diskStorage({
                destination: function (req, file, cb) {
                    const uploadPath = path.resolve('./public/upload')
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, {recursive: true});
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
                }
            })
        }),

    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {
}
