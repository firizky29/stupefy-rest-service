import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";

class SongController extends BaseController {
    getAllSongs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const songs = await this.prisma.song.findMany();
            res.status(200).json(songs);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getSongById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const song = await this.prisma.song.findUnique({
                where: {
                    song_id: parseInt(req.params.song_id)
                }
            });
            res.status(200).json(song);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    createSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const song = await this.prisma.song.create({
                data: {
                    ...req.body
                }
            });
            res.status(201).json(song);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    updateSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const song = await this.prisma.song.update({
                where: {
                    song_id: parseInt(req.params.song_id)
                },
                data: {
                    ...req.body
                }
            });
            res.status(200).json(song);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    deleteSong = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const song = await this.prisma.song.delete({
                where: {
                    song_id: parseInt(req.params.song_id)
                }
            });
            res.status(200).json(song);
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new SongController();
