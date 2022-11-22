import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";

class SingerController extends BaseController{
    getAllSinger = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const singer = await this.prisma.user.findMany({
                where: {
                   isAdmin: false, 
                }
            });
            res.status(200).json(singer);
            res.status(200).send('masuk');
        }catch(error){
            res.status(500).send({message : "Internal Server Error 1" });
        }
    }
    
    getAllSongsOfSinger = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const song = await this.prisma.song.findMany({
                where: {
                    penyanyi_id: parseInt(req.params.penyanyi_id),
                }
            });
            res.status(200).json(song);
        }catch(error){
            res.status(500).send({message : "Internal Server Error 2" });
        }
    }
}

export default new SingerController;