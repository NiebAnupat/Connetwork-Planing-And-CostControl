import {
    BadRequestException,
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {USER_REPOSITORY} from "src/constants";
import {DeleteResult, FindOptionsWhere, ObjectId, Repository, UpdateResult} from "typeorm";
import {ObjectId as MongoObjectId} from "mongodb";
import {User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import {JwtPayload, JwtToken} from "src/auth/jwt";
import {AuthService} from "src/auth/auth.service";
import {SELECT_FIELD} from "./constant";

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<JwtToken> {
        try {
            // check if user already exists
            const userExists = await this.userRepository.findOne({
                where: {
                    email: createUserDto.email
                }
            });

            if (userExists) throw new BadRequestException('User already exists');

            // hash password
            const salt = await bcrypt.genSalt();
            createUserDto.password = await bcrypt.hash(createUserDto.password, salt);


            const user = await this.userRepository.save(createUserDto);
            if (!user) throw new ConflictException('Error while creating user');

            const payload: JwtPayload = {
                sub: user._id,
                iat: Date.now(),
                email: user.email
            }

            return await this.authService.signPayload(payload);

            // return user;
        } catch (e) {
            throw e
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                select: SELECT_FIELD
            });
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
                },
                select: SELECT_FIELD
            });
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (e) {
            console.log({e})
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while fetching user');
        }
    }

    // async findOneByQuery(query: FindOptionsWhere<User>): Promise<User> {
    async findOneByQuery(query: FindOptionsWhere<User>): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: query,
                select: SELECT_FIELD
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

    // Product Part--------------------------------------------------------------

    /** NOTE:
     * subscriptionProduct when payment success
     */
    async subscriptionProduct(userID: ObjectId, duration: number): Promise<UpdateResult> {
        try {
            if (!MongoObjectId.isValid(userID)) throw new BadRequestException('Invalid user id')

            const user: User = await this.userRepository.findOne({
                where: {
                    _id: new MongoObjectId(userID)
                }
            });
            if (!user) throw new NotFoundException('User not found');


            /**
             IMPLEMENT : if user already subscription
             user have already registered, old data will be used
             user.registeredProductID.forEach((item) => {});
             **/


                // if fist time subscription
                // add product data to user
            let updateData: UpdateUserDto = {
                    ...user, // Make sure to copy other properties from user if needed
                    // productData: user.productData ? [...user.productData] : [], // Copy existing product data if available
                    dateRemaining: 0, // Initialize dateRemaining as a number
                };
            // if (!user.productData) {
            //     updateData.productData = {
            //         registeredProductID: [],
            //         registeredProduct: []
            //     }
            // }


            // update dateRemaining
            updateData.dateRemaining = parseInt(user.dateRemaining.toString()) + parseInt(duration.toString());


            // register product
            const result: UpdateResult = await this.userRepository.update({
                _id: new MongoObjectId(userID)
            }, updateData);


            if (result.affected <= 0) throw new NotFoundException('User not found');
            return result;
        } catch (e) {
            console.log({e})
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            throw new ConflictException('Error while subscription product');
        }
    }


}
