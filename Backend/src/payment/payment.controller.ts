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
    Res, Query, NotFoundException, BadRequestException, ForbiddenException
} from '@nestjs/common';
import {Response} from "express";
import {PaymentService} from './payment.service';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {v4} from "uuid";
import { readFileSync, unlinkSync} from "fs";
import {ObjectId} from "typeorm";
import {UserService} from "../user/user.service";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import axios from "axios";
import * as QrCode from 'qrcode-reader';
import Jimp from "jimp";

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly userService: UserService,
        private readonly cloudStorageService: CloudStorageService,
    ) {
    }

    @Post("/")
    @UseInterceptors(FileInterceptor('slipImage'))
    async create(@Body() createPaymentDto: CreatePaymentDto, @UploadedFile() file: Express.Multer.File) {

        createPaymentDto.timestamp = new Date().toISOString()
        const mediaId = v4()
        const ext = file.originalname.split('.').pop()
        const path = `pay-slip/${mediaId}.${ext}`
        // const url = this.cloudStorageService.save(path, file.buffer)
        const buffer = readFileSync(file.path)


        // if (!qrCode.result) throw new BadRequestException("invalid slip")
        // console.log('QR Code content:', qrCode.result);

        createPaymentDto.mediaId = mediaId
        createPaymentDto.filename = `${mediaId}.${ext}`
        // createPaymentDto.qrCode = qrCode.result

        await this.cloudStorageService.save(path, file.mimetype, buffer, [{
            mediaId,
        }])
        unlinkSync(file.path)


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

    @Patch('verify')
    async verify(@Query() query: { mediaId: string, userId: ObjectId }) {
        const {SLIPOK_API_URL, SLIPOK_BRAND_ID, SLIPOK_API_KEY} = process.env
        const user = await this.userService.findOne(query.userId)
        const payment = user.paymentData.find(payment => payment.mediaId === query.mediaId)
        if (!payment) throw new NotFoundException("payment not found")
        const slipImg = await this.paymentService.findOneImg(`pay-slip/${payment.filename}`);

        const buffer = slipImg.buffer
        const qr = new QrCode()
        const bitmap = await Jimp.read(buffer).then(image => image.bitmap).catch(e => {
            console.log({e})
        })

        let qrString = ""
        qr.callback = function (err, value) {
            if (err) {
                throw new BadRequestException("invalid slip")
            }
            qrString = value.result
        }
        await qr.decode(bitmap)
        const res = await axios.post(`${SLIPOK_API_URL}/${SLIPOK_BRAND_ID}`, {
            data: qrString,
        }, {
            headers: {
                "x-authorization": SLIPOK_API_KEY,
            }
        }).then(res => res.data).catch(e => {
            console.log(e.response.data)
        })


        if (res.success) {
            if (res.data.amount !== payment.amount) throw new ForbiddenException(`invalid amount, expected ${payment.amount} but got ${res.data.amount}`)

            payment.isVerified = true
            const updateUserDto: UpdateUserDto = {
                paymentData: user.paymentData
            }
            await this.userService.update(user._id, updateUserDto)
            return res
        } else {
            throw new BadRequestException("invalid slip")
        }
    }
}
