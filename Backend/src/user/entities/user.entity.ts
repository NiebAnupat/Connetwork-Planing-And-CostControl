import {Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from "typeorm";

@Entity({name: 'user'})
export class User {
    @ObjectIdColumn()
    _id: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    username: string;

    @Column({
        default: false,
    })
    isFreeTrial: boolean;

    @Column({
        default: 0,
    })
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


}
