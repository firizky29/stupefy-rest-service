import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import { CONST } from "../constants/constant";

interface JWTPayload{
    penyanyi_id : number;
}
class SongController extends BaseController {
    getSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const cookie = req.cookies['jwt'];
            // const { penyanyi_id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = 1;


            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const songs = await this.prisma.song.findMany({
                where: {
                    penyanyi_id: penyanyi_id,
                },
                select: {
                    song_id: true,
                    Judul: true,
                },
                skip: offset,
                take: limit

            });
            res.status(200).json(songs);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getSongById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const song_id = parseInt(req.params.id);

            const song_path = await this.prisma.song.findUnique({
                where: {
                    song_id: song_id
                },
                select: {
                    Audio_path: true
                }
            });
            if(song_path){
                res.setHeader('Content-Type', 'audio/mpeg');
                res.sendFile(song_path.Audio_path);
            } else{
                res.status(404).send({message : "Song not found"});
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    createSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const cookie = req.cookies['jwt'];
            // const { penyanyi_id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = 1;

            if(req.file){
                console.log(req.file);
                const song = await this.prisma.song.create({
                    data: {
                        ...req.body,
                        Audio_path: req.file.path,
                        penyanyi_id: penyanyi_id,
                    }
                });
                res.status(201).json({song:song, file:req.file});
            } else{
                res.status(400).send({message : "Audio file is required"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    updateSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const oldSong = await this.prisma.song.findUnique({
                where: {
                    song_id: parseInt(req.params.id)
                },
                select: {
                    Audio_path: true
                }
            });

            if(req.file){   
                req.body = {...req.body, Audio_path: req.file.path};
            }

            if(oldSong){
                const song = await this.prisma.song.update({
                    where: {
                        song_id: parseInt(req.params.id)
                    },
                    data: {
                        ...req.body
                    }
                });
                
                if(req.file){
                    if(fs.existsSync(oldSong.Audio_path)){
                        fs.unlinkSync(oldSong.Audio_path);
                    }
                }
                res.status(200).json(song);
            } else{
                res.status(404).send({message : "Song not found"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    deleteSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const oldSong = await this.prisma.song.findUnique({
                where: {
                    song_id: parseInt(req.params.id)
                },
                select: {
                    Audio_path: true
                }
            });

            
            if(oldSong){
                const song = await this.prisma.song.delete({
                    where: {
                        song_id: parseInt(req.params.id)
                    }
                });

                if(fs.existsSync(oldSong.Audio_path)){
                    fs.unlinkSync(oldSong.Audio_path);
                }

                res.status(200).json(song);

            } else{
                res.status(404).send({message : "Song not found"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new SongController();
