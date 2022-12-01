import { CONST } from "../constants/constant";
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

interface JwtPayload {
    user_id: number;
    display_name: string;
    username: string;
}

export const admin = async (req: Request, res: Response, next: NextFunction) => {
    
    try{
        const cookie = req.cookies.stupefy_token;
        
        const decoded = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

        if(!decoded) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }   
        const user = await new PrismaClient().user.findUnique({ where: { user_id: decoded.user_id } });
        if(!user?.isAdmin) {
            return res.status(401).json({
                message: "Unauthorized Role"    
            });
        }
        return next()

    } catch(err){
        return res.status(401).send({message: "Unauthorized"});
    }
}
