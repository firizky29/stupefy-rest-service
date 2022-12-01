import { CONST } from "../constants/constant";
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";

interface JwtPayload {
    user_id: number;
    display_name: string;
    username: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.cookies.stupefy_token;

    try{
        const decoded = jwt.verify(token, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;
        if(decoded){
            next();
        } else{
            res.status(401).json({
                message: "Unauthorized"
            });
        }
    } catch(err){
        res.status(401).json({
            message: "Unauthorized"
        });
    }

}
