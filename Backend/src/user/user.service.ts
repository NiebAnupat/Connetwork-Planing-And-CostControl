import {BadRequestException, ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {USER_REPOSITORY} from "src/constants";
import {DeleteResult, ObjectId, Repository, UpdateResult} from "typeorm";
import {ObjectId as MongoObjectId} from "mongodb";
import {User} from "./entities/user.entity";

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.save(createUserDto);
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.find();
            if (users.length <= 0) throw new NotFoundException('Users not found')
            return users;
        } catch (e) {
            if (e instanceof NotFoundException) throw e;
            throw new ConflictException('Error while fetching users');
        }
    }

    async findOne(id: ObjectId): Promise<User> {
        try {

            if (!MongoObjectId.isValid(id)) throw new BadRequestException('Invalid user id')

            const user = await this.userRepository.findOne({
                where: {
                    _id: new MongoObjectId(id)
                }
            });
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (e) {
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while fetching user');
        }
    }

    async findOneByQuery(query: UpdateUserDto): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: query
            });
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (e) {
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while fetching user');
        }
    }

    async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        try {

            if (!MongoObjectId.isValid(id)) throw new BadRequestException('Invalid user id')

            // check if user exists
            const user = await this.userRepository.findOne({
                where: {
                    _id: new MongoObjectId(id)
                }
            });


            const result = await this.userRepository.update({
                _id: new MongoObjectId(id)
            }, updateUserDto);
            if (result.affected <= 0) throw new NotFoundException('User not found');
            return result;
        } catch (e) {
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while updating user');

        }
    }

    async remove(id: ObjectId): Promise<DeleteResult> {
        try {
            if (!MongoObjectId.isValid(id)) throw new BadRequestException('Invalid user id')

            const result = await this.userRepository.delete({
                _id: new MongoObjectId(id)
            });
            if (result.affected <= 0) throw new NotFoundException('User not found');
            return result;
        } catch (e) {
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while deleting user');
        }
    }
}
