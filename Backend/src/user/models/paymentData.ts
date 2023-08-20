import {Column} from "typeorm";

export class PaymentData {
    @Column()
    payId: string;

    @Column()
    timestamp: string

    @Column()
    amount: number = 0

    @Column()
    filename: string;

    @Column()
    isVerified: boolean
}
