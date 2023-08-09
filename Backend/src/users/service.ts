import {Prisma, PrismaClient, users} from "@prisma/client";



export class UsersService {

    private static prisma = new PrismaClient();

    static async create(data: users) {
        return await this.prisma.users.create({data});
    }

    static async findAll() {
        return await this.prisma.users.findMany();
    }

    static async findOne(where: Prisma.usersWhereUniqueInput) {
        return await this.prisma.users.findUnique({where});
    }

    static async update(
        where: Prisma.usersWhereUniqueInput,
        data: Prisma.usersUpdateInput
    ) {
        return await this.prisma.users.update({where, data});
    }

    static async remove(where: Prisma.usersWhereUniqueInput) {
        return this.prisma.users.delete({where});
    }
}
