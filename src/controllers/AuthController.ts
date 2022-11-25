import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";

class AuthController extends BaseController {
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password, email } = req.body;
            const user = await this.prisma.user.create({
                data: {
                    name: username,
                    username: username,
                    password: password,
                    email: email,
                    isAdmin: false
                }
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new AuthController;