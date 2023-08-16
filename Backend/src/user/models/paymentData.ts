import {Column} from "typeorm";

export class PaymentData {
    @Column()
    uid: string;

    @Column()
    timestamp: string

    @Column()
    amount: number = 0

    @Column()
    imagePath: string;

    @Column()
    isVerified: boolean
}
