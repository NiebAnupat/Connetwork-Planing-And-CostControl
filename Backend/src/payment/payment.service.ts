import {Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {UserService} from "../user/user.service";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {User} from "../user/entities/user.entity";
import {CloudStorageService} from "../cloud-storage/cloud-storage.service";
import {StorageFile} from "../cloud-storage/models/storage-file";

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
            uid: createPaymentDto.uid,
            timestamp: createPaymentDto.timestamp,
            amount: createPaymentDto.amount,
            imagePath: createPaymentDto.imagePath,
            isVerified: createPaymentDto.isVerified
        })

        const updateUserDto: UpdateUserDto = {
            paymentData: user.paymentData
        }

        await this.userService.update(user._id, updateUserDto)

        return user

    }

    findAll() {
        return `This action returns all payment`;
    }

    async findOne(path: string) {

        let storageFile: StorageFile
        try {
            storageFile = await this.cloudStorageService.getWithMetaData(path)
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

    update(id: number, updatePaymentDto: UpdatePaymentDto) {
        return `This action updates a #${id} payment`;
    }

    remove(id: number) {
        return `This action removes a #${id} payment`;
    }
}
