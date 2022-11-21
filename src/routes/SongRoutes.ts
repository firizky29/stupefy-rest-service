import BaseRoutes from "./BaseRoutes";
import SongController from "../controllers/SongController";

class SongRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SongController.getAllSongs);
        this.routes.get("/:id", SongController.getSongById);
        this.routes.post("/", SongController.createSong);
        this.routes.put("/:id", SongController.updateSong);
        this.routes.delete("/:id", SongController.deleteSong);
    }
}

export default new SongRoutes().routes;