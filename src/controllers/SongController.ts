import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import { CONST } from "../constants/constant";
import path from "path";

interface JWTPayload{
    user_id: number;
    display_name: string;
    username: string;
}

class SongController extends BaseController {
    getSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies.stupefy_token;
            const { user_id, display_name, username } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = user_id;


            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const total = await this.prisma.song.count(
                {
                    where: {
                        penyanyi_id
                    }
                }
            );

            const songs = await this.prisma.song.findMany({
                where: {
                    penyanyi_id: penyanyi_id,
                },
                select: {
                    song_id: true,
                    Judul: true,
                    createdAt: true,
                },
                skip: offset,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            });
            // console.log(songs)
            res.status(200).json({data: songs, total_page: Math.ceil(total/limit), total_song: songs.length});
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getSongById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies.stupefy_token;
            const { user_id, display_name, username } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = user_id;

            const song_id = parseInt(req.params.id);

            const song_path = await this.prisma.song.findFirst({
                where: {
                    song_id: song_id,
                    penyanyi_id: penyanyi_id
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

    createSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies.stupefy_token;
            const { user_id, display_name, username } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = user_id;

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
            const cookie = req.cookies.stupefy_token;
            const { user_id, display_name, username } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = user_id;

            const oldSong = await this.prisma.song.findFirst({
                where: {
                    song_id: parseInt(req.params.id),
                    penyanyi_id: penyanyi_id
                },
                select: {
                    Audio_path: true
                }
            });

            if(req.file){   
                req.body = {...req.body, Audio_path: req.file.path};
            }

            if(oldSong){
                const song = await this.prisma.song.updateMany({
                    where: {
                        song_id: parseInt(req.params.id),
                        penyanyi_id: penyanyi_id
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
            const cookie = req.cookies.stupefy_token;
            const { user_id, display_name, username } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JWTPayload;
            const penyanyi_id = user_id;

            const oldSong = await this.prisma.song.findFirst({
                where: {
                    song_id: parseInt(req.params.id),
                    penyanyi_id: penyanyi_id
                },
                select: {
                    Audio_path: true
                }
            });

            
            if(oldSong){
                const song = await this.prisma.song.deleteMany({
                    where: {
                        song_id: parseInt(req.params.id),
                        penyanyi_id: penyanyi_id
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
