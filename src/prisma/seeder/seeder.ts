import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

(async () => {
    const prisma = new PrismaClient();
    const hashedPassword = await bcrypt.hash("Admin.123", 10);


    const user = await prisma.user.create({
        data: {
            name: "admin",
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            isAdmin: true
        }
    });
})();

