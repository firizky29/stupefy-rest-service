import BaseRoutes from "./BaseRoutes";
import SongController from "../controllers/SongController";

import upload from "../middlewares/multer";

class SongRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SongController.getSongs);
        this.routes.get("/:id", SongController.getSongById);
        this.routes.post("/", upload.single('file'), SongController.createSong);
        this.routes.put("/:id", upload.single('file'), SongController.updateSong);
        this.routes.delete("/:id", SongController.deleteSong);
        
    }
}

export default new SongRoutes().routes;