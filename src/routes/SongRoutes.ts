import BaseRoutes from "./BaseRoutes";
import SongController from "../controllers/SongController";

import upload from "../middlewares/multer";
import { verifyToken } from "../middlewares/verifyToken";

class SongRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", [verifyToken], SongController.getSongs);
        this.routes.get("/:id", [verifyToken], SongController.getSongById);
        this.routes.post("/", [verifyToken, upload.single('file')], SongController.createSong);
        this.routes.put("/:id", [verifyToken, upload.single('file')], SongController.updateSong);
        this.routes.delete("/:id", [verifyToken], SongController.deleteSong);
    }
}

export default new SongRoutes().routes;