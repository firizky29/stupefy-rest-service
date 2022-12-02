import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

(async () => {
    const prisma = new PrismaClient();
    const hashedPassword = await bcrypt.hash("Admin.123", 10);
    const hashedPassword2 = await bcrypt.hash("User.123", 10);


    const user = await prisma.user.create({
        data: {
            name: "admin",
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            isAdmin: true
        }
    });
    const user2 = await prisma.user.create({
        data: {
            name: "biduan",
            username: "biduan",
            email: "biduan@gmail.com",
            password: hashedPassword2,
            isAdmin: false
        }
    });
})();

