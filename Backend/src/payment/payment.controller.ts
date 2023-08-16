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
    Res
} from '@nestjs/common';
import {Response} from "express";
import {PaymentService} from './payment.service';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {v4} from "uuid";
import * as fs from "fs";

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
        const path = `${mediaId}-${file.filename}`
        // const url = this.cloudStorageService.save(path, file.buffer)
        const buffer = fs.readFileSync(file.path)
        await this.cloudStorageService.save(`pay-slip/${path}`, file.mimetype, buffer, [{
            mediaId,
        }])


        createPaymentDto.uid = mediaId
        createPaymentDto.imagePath = path


        return this.paymentService.create(createPaymentDto);

        // return this.paymentService.create(createPaymentDto);
    }

    @Get()
    findAll() {
        return this.paymentService.findAll();
    }

    @Get(':path')
    async findOne(@Param('path') path: string, @Res() res: Response) {
        const storageFile = await this.paymentService.findOne(`pay-slip/${path}`);
        res.setHeader("Content-Type", storageFile.contentType);
        res.setHeader("Content-Length", storageFile.buffer.length)
        // res.setHeader("Content-Disposition", `attachment; filename=${path}`);
        res.setHeader("Content-Disposition", `inline; filename=${path}`)
        res.setHeader("Cache-Control", "max-age=1d");
        return res.end(storageFile.buffer);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentService.update(+id, updatePaymentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.paymentService.remove(+id);
    }
}
