import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import { getClient } from "../lib/cache";
import * as fs from "fs";

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
                    },
                    select: {
                        user_id: true,
                        name: true,
                    },
                });
                console.log("berhasil get singer");
                client.set('singer', JSON.stringify(singer));
                console.log("berhasil set ke cache");
                res.setHeader('Access-Control-Allow-Origin','*');
                res.status(200).json(singer);
                console.log("berhasil kirim");
            }

        }catch(error){
            console.log(error);
            res.status(500).send({message : "Internal Server Error" });
        }
    }
    
    getAllSongsOfSinger = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const song = await this.prisma.song.findMany({
                where: {
                    penyanyi_id: parseInt(req.params.id),
                }
            });
            res.status(200).json(song);
        }catch(error){
            res.status(500).send({message : "Internal Server Error" });
        }
    }

    getSingerById = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const singer = await this.prisma.user.findFirst({
                where: {
                    user_id: parseInt(req.params.id),
                    isAdmin: false,
                },
                select: {
                    user_id: true,
                    name: true,
                },
            });
            res.status(200).json(singer);
        } catch(error){
            res.status(500).send({message : "Internal Server Error" });
        }
    }

    getSongById = async (req : Request, res : Response, next : NextFunction) => {
        try{
            const song_id = parseInt(req.params.id);

            const song_path = await this.prisma.song.findFirst({
                where: {
                    song_id: song_id,
                },
                select: {
                    Audio_path: true
                }
            });
            if(song_path){
                const stat = fs.statSync(song_path.Audio_path);
                
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });
            
                const readStream = fs.createReadStream(song_path.Audio_path);
                readStream.pipe(res);
            } else{
                res.status(404).send({message : "Song not found"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new SingerController;