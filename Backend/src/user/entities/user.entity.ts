import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ObjectId,
    ObjectIdColumn,
    UpdateDateColumn
} from "typeorm";
import {ProductData} from "../models/productData";
import {PaymentData} from "../models/paymentData";


@Entity({name: 'user'})
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    email: string;

    @Column()
    public password: string;

    @Column()
    username: string;

    @Column()
    role: string;
    @Column()
    isFreeTrial: boolean;

    @Column()
    dateRemaining: number;

    @CreateDateColumn({
        name: 'created_at',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updated_at: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deleted_at: Date;

    @Column({
        default: false,
    })
    isDeleted: boolean;

    @Column({
        default: false,
    })
    isVerified: boolean;

    @Column({
        default: null,
    })
    productData?: ProductData;

    @Column({
        default: null,
    })
    paymentData?: PaymentData[]


}
