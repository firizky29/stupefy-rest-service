import { Request, Response, NextFunction } from "express";
import { CONST } from "../constants/constant";
import jwt from "jsonwebtoken";

interface JwtPayload {
    user_id: number;
    display_name: string;
    username: string;
}

export const guest = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cookie = req.cookies['stupefy_token'];

        // console.log(cookie);
        
        const decoded = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

        if(!decoded) {
            // console.log("guest");
            return next()
        }   

        return res.status(401).json({
            message: "Please logout first"
        });

    } catch(err){
        // console.log("guest");
        return next();
    }
}
