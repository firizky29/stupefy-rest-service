import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CONST } from "../constants/constant";
import { getClient } from "../lib/cache";

interface JwtPayload {
    user_id: number;
    display_name: string;
    username: string;
}

class AuthController extends BaseController {
    register = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            let client = await getClient();
            let cache = await client.get("singer");


            let { name, username, email, password } = req.body;
            const countUserName = await this.prisma.user.count({
                where: {
                    username: username
                }
            });

            if (countUserName > 0) {
                return res.status(404).json({
                    username: "Username already exists" 
                });
            }

            const countEmail = await this.prisma.user.count({
                where: {
                    email: email
                }
            });

            if (countEmail > 0) {
                return res.status(404).json({
                    email: "Email already exists"
                });
            }

            const hash = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    name: name,
                    username: username,
                    email: email,
                    password: hash,
                    isAdmin: false
                }
            });

            const payload = {
                user_id: user.user_id,
                display_name: user.name,
                username: user.username
            }

            const token = jwt.sign(payload, CONST.JWT_SECRET_KEY || "secret");

            // console.log("Hi");
            res.cookie("stupefy_token", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            // console.log("hi 2");
            if(cache){
                client.del("singer");
            }

            return res.status(200).json({
                message: "Registration successful"
            });

        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
        
    }

    login = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const user = await this.prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (!user) {
                return res.status(401).send({ message: "Invalid username or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({ message: "Invalid username or password" });
            }

            const token = jwt.sign({
                    user_id: user.user_id,
                    display_name: user.name,
                    username: user.username
                }, CONST.JWT_SECRET_KEY|| "secret",
            );
            res.cookie("stupefy_token", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            return res.status(200).json({
                message: "Login successful"
            });
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getRole = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { user_id, display_name, username } = jwt.verify(req.cookies.stupefy_token, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

            const user = await this.prisma.user.findUnique({
                where: {
                    user_id: user_id
                }
            });
            if (!user) {
                return res.status(401).send({ message: "Unauthorized" });
            }

            return res.status(200).json({
                message: "Role fetched successfully",
                name: display_name,
                role: user.isAdmin ? "Admin" : "Singer"
            });
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    logout = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            res.clearCookie("stupefy_token");
            return res.status(200).json({
                message: "Logout successful"
            });
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

}

export default new AuthController;