import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import { getClient } from "../lib/cache";
import * as redis from 'redis'

class SingerController extends BaseController{
    getAllSinger = async (req : Request, res : Response, next : NextFunction) => {
        try{
            let client = await getClient();
            let cache = await client.get("singer");
            if(cache && cache.length > 2){
                res.json(JSON.parse(cache));
            }else{
                console.log("gaada di cache");
                const singer = await this.prisma.user.findMany({
                    where: {
                       isAdmin: false, 
                    }
                });
                console.log("berhasil get singer");
                client.set('singer', JSON.stringify(singer));
                console.log("berhasil set ke cache");
                res.status(200).json(JSON.stringify(singer));
                console.log("berhasil kirim");
            }

        }catch(error){
            console.log(error);
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