import {Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {UserService} from "../user/user.service";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {User} from "../user/entities/user.entity";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {StorageFile} from "../cloud-storage/models/storage-file";
import {ObjectId} from "typeorm";

@Injectable()
export class PaymentService {

    constructor(
        private readonly userService: UserService,
        private readonly cloudStorageService: CloudStorageService
    ) {
    }


    async create(createPaymentDto: CreatePaymentDto) {

        const user: User = await this.userService.findOne(createPaymentDto.userId)

        if (!user.paymentData) user.paymentData = []

        user.paymentData.push({
            mediaId: createPaymentDto.mediaId,
            timestamp: createPaymentDto.timestamp,
            amount: createPaymentDto.amount,
            filename: createPaymentDto.filename,
            isVerified: createPaymentDto.isVerified
        })

        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }

        await this.userService.update(user._id, updateUserDto)

        return user

    }

    async findAll(userId: ObjectId) {
        const users = await this.userService.findOne(userId)
        return users.paymentData
    }

    async findOne(id: string, userId: ObjectId) {
        const user = await this.userService.findOne(userId)
        const payment = user.paymentData.find(payment => payment.mediaId === id)
        if (!payment) throw new NotFoundException("payment not found")
        return payment
    }

    async findOneImg(filename: string) {

        let storageFile: StorageFile
        try {
            storageFile = await this.cloudStorageService.getWithMetaData(filename)
        } catch (e) {
            if (e.message.toString().includes("No such object")) {
                throw new NotFoundException("image not found");
            } else {
                console.log({e})
                throw new ServiceUnavailableException("internal error");
            }
        }

        return storageFile
    }

    async update(criteria: { userId: ObjectId, mediaId: string }, updatePaymentDto: UpdatePaymentDto) {
        const user = await this.userService.findOne(criteria.userId)
        const payment = user.paymentData.find(payment => payment.mediaId === criteria.mediaId)
        if (!payment) throw new NotFoundException("payment not found")
        payment.isVerified = updatePaymentDto.isVerified
        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }
        const result = await this.userService.update(user._id, updateUserDto)
        return user.paymentData.find(payment => payment.mediaId === criteria.mediaId)
    }

    async remove(criteria: { userId: ObjectId, mediaId: string }) {
        const user = await this.userService.findOne(criteria.userId)
        const payment = user.paymentData.find(payment => payment.mediaId === criteria.mediaId)
        if (!payment) throw new NotFoundException("payment not found")
        user.paymentData = user.paymentData.filter(payment => payment.mediaId !== criteria.mediaId)
        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }
        await this.cloudStorageService.delete(`pay-slip/${payment.filename}`)
        return await this.userService.update(user._id, updateUserDto)
    }
}
