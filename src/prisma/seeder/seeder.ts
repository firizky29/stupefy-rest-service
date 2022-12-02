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

    for(let i =1;i <=30;i++) {
        await prisma.user.create({
            data: {
                name: `name${i}`,
                username: `user${i}`,
                email: `test${i}@gmail.com`,
                password: await bcrypt.hash("User.123", 10),
                isAdmin: false
            }
        });
    }
})();

