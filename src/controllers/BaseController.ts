import { PrismaClient } from '@prisma/client';

abstract class BaseController {
    protected prisma: PrismaClient;

    constructor() {
        // this.userRepository = AppDataSource.getRepository(User)
        // this.transactionRepository = AppDataSource.getRepository(Transaction)
        this.prisma = new PrismaClient();
    }
}

export default BaseController;