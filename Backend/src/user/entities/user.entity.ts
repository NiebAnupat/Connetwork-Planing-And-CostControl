import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ObjectId,
    ObjectIdColumn,
    UpdateDateColumn
} from "typeorm";


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

    @Column()
    productData: any[];


}
