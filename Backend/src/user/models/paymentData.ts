import {Column} from "typeorm";

export class PaymentData {
    @Column()
    mediaId: string;

    @Column()
    timestamp: string

    @Column()
    amount: number = 0

    @Column()
    filename: string;

    @Column()
    qrCode: string;

    @Column()
    isVerified: boolean
}
