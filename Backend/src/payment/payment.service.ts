import {Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {UserService} from "../user/user.service";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {User} from "../user/entities/user.entity";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {StorageFile} from "../cloud-storage/models/storage-file";
import {ObjectId} from "typeorm";
import {PaymentData} from "../user/models/paymentData";

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
            payId: createPaymentDto.payId,
            timestamp: createPaymentDto.timestamp,
            amount: createPaymentDto.amount,
            filename: createPaymentDto.filename,
            isVerified: createPaymentDto.isVerified
        })

        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }

        await this.userService.update(user._id, updateUserDto)

        return user.paymentData.find(payment => payment.payId === createPaymentDto.payId)

    }

    async findAll(userId: ObjectId) {
        const users = await this.userService.findOne(userId)
        return users.paymentData
    }

    async findOne(id: string, userId: ObjectId) {
        const user = await this.userService.findOne(userId)
        const payment = user.paymentData.find(payment => payment.payId === id)
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

    async update(criteria: { userId: ObjectId, payId: string }, updatePaymentDto: UpdatePaymentDto) {
        const user = await this.userService.findOne(criteria.userId)
        const payment: PaymentData = user.paymentData.find(payment => payment.payId === criteria.payId)
        if (!payment) throw new NotFoundException("payment not found")


        user.paymentData = user.paymentData.map(payment => {
            if (payment.payId === criteria.payId) {
                return {
                    ...payment,
                    ...updatePaymentDto,
                }
            }
            return payment
        })

        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }
        const result = await this.userService.update(user._id, updateUserDto)
        return user.paymentData.find(payment => payment.payId === criteria.payId)
    }

    async remove(criteria: { userId: ObjectId, payId: string }) {
        const user = await this.userService.findOne(criteria.userId)
        const payment = user.paymentData.find(payment => payment.payId === criteria.payId)
        if (!payment) throw new NotFoundException("payment not found")
        user.paymentData = user.paymentData.filter(payment => payment.payId !== criteria.payId)
        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }
        await this.cloudStorageService.delete(`pay-slip/${payment.filename}`)
        return await this.userService.update(user._id, updateUserDto)
    }
}
