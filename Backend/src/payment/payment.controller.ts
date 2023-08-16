import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Header,
    Res, Query
} from '@nestjs/common';
import {Response} from "express";
import {PaymentService} from './payment.service';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {v4} from "uuid";
import * as fs from "fs";
import {ObjectId} from "typeorm";

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly cloudStorageService: CloudStorageService) {
    }

    @Post("/")
    @UseInterceptors(FileInterceptor('slipImage'))
    async create(@Body() createPaymentDto: CreatePaymentDto, @UploadedFile() file: Express.Multer.File) {

        createPaymentDto.timestamp = new Date().toISOString()
        const mediaId = v4()
        const ext = file.originalname.split('.').pop()
        const path = `pay-slip/${mediaId}.${ext}`
        // const url = this.cloudStorageService.save(path, file.buffer)
        const buffer = fs.readFileSync(file.path)
        await this.cloudStorageService.save(path, file.mimetype, buffer, [{
            mediaId,
        }])
        fs.unlinkSync(file.path)

        createPaymentDto.mediaId = mediaId
        createPaymentDto.filename = `${mediaId}.${ext}`


        return this.paymentService.create(createPaymentDto);

    }

    @Get(':userId')
    findAll(@Param('userId') userId: ObjectId) {
        return this.paymentService.findAll(userId);
    }

    @Get()
    findOne(@Query() query: { mediaId: string, userId: ObjectId }) {
        return this.paymentService.findOne(query.mediaId, query.userId);
    }


    @Get('img/:filename')
    async findOneImg(@Param('filename') filename: string, @Res() res: Response) {
        const storageFile = await this.paymentService.findOneImg(`pay-slip/${filename}`);
        res.setHeader("Content-Type", storageFile.contentType);
        res.setHeader("Content-Length", storageFile.buffer.length)
        res.setHeader("Content-Disposition", `inline; filename=${filename}`)
        res.setHeader("Cache-Control", "max-age=1d");
        return res.end(storageFile.buffer);
    }

    @Patch()
    update(@Query() query: { mediaId: string, userId: ObjectId }, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentService.update({userId: query.userId, mediaId: query.mediaId}, updatePaymentDto);
    }

    @Delete()
    remove(@Query() query: { mediaId: string, userId: ObjectId }) {
        return this.paymentService.remove({userId: query.userId, mediaId: query.mediaId});
    }
}
