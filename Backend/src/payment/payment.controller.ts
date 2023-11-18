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
import {readFileSync, unlinkSync} from "fs";
import {ObjectId} from "typeorm";
import {UserService} from "../user/user.service";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import axios from "axios";
import * as QrCode from 'qrcode-reader';
import Jimp from "jimp";

@Controller('payment')
export class PaymentController {
    private qr = new QrCode()

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
        const payId = v4()
        const ext = file.originalname.split('.').pop()
        const path = `pay-slip/${payId}.${ext}`
        // const url = this.cloudStorageService.save(path, file.buffer)
        const buffer = readFileSync(file.path)


        // if (!qrCode.result) throw new BadRequestException("invalid slip")
        // console.log('QR Code content:', qrCode.result);

        createPaymentDto.payId = payId
        createPaymentDto.filename = `${payId}.${ext}`
        // createPaymentDto.qrCode = qrCode.result

        await this.cloudStorageService.save(path, file.mimetype, buffer, [{
            payId,
        }])
        unlinkSync(file.path)


        return this.paymentService.create(createPaymentDto);

    }

    @Get(':userId')
    findAll(@Param('userId') userId: ObjectId) {
        return this.paymentService.findAll(userId);
    }

    @Get()
    findOne(@Query() query: { payId: string, userId: ObjectId }) {
        return this.paymentService.findOne(query.payId, query.userId);
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
    @UseInterceptors(FileInterceptor('slipImage'))
    async update(@Query() query: { payId: string, userId: ObjectId }, @Body() updatePaymentDto: UpdatePaymentDto, @UploadedFile() file: Express.Multer.File) {
        if (file) {

            // when update image , delete old image in cloud storage
            const payment = await this.paymentService.findOne(query.payId, query.userId)
            if (!payment) throw new NotFoundException("payment not found")
            await this.cloudStorageService.delete(`pay-slip/${payment.filename}`)

            // save new image to cloud storage
            const ext = file.originalname.split('.').pop()
            const path = `pay-slip/${query.payId}.${ext}`
            const buffer = readFileSync(file.path)
            await this.cloudStorageService.save(path, file.mimetype, buffer, [{
                payId: query.payId,
            }])
            unlinkSync(file.path)
            updatePaymentDto.filename = `${query.payId}.${ext}`
        }
        return this.paymentService.update({userId: query.userId, payId: query.payId}, updatePaymentDto);
    }

    @Delete()
    remove(@Query() query: { payId: string, userId: ObjectId }) {
        return this.paymentService.remove({userId: query.userId, payId: query.payId});
    }

    @Patch('verify')
    async verify(@Query() query: { payId: string, userId: ObjectId }) {
        const {SLIPOK_API_URL, SLIPOK_BRAND_ID, SLIPOK_API_KEY} = process.env
        const user = await this.userService.findOne(query.userId)
        const payment = user.paymentData.find(payment => payment.payId === query.payId)
        if (!payment) throw new NotFoundException("payment not found")
        const slipImg = await this.paymentService.findOneImg(`pay-slip/${payment.filename}`);

        const buffer = slipImg.buffer

        const bitmap = await Jimp.read(buffer).then(image => image.bitmap).catch(e => {
            throw new BadRequestException({
                success: false,
                message: "invalid slip"
            })
        })

        let qrString = ""
        this.qr.callback = function (err, value) {
            if (err) {
                throw new BadRequestException({
                    success: false,
                    message: "invalid slip"
                })
            }
            qrString = value.result
        }
        await this.qr.decode(bitmap)
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
            return {
                success: true,
                message: "payment verified"
            }
        } else {
            throw new BadRequestException({
                success: false,
                message: "invalid slip"
            })
        }
    }
}
