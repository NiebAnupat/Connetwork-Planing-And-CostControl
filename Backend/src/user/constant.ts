import {User} from "./entities/user.entity";
import {FindOptionsSelect, FindOptionsSelectByString} from "typeorm";

export const SELECT_FIELD: FindOptionsSelect<User> | FindOptionsSelectByString<User> = [
    '_id',
    'email',
    'username',
    'role',
    'isFreeTrial',
    'dateRemaining',
    'created_at',
    'updated_at',
    'deleted_at',
    'isDeleted',
    'isVerified',
    'productData'
]
