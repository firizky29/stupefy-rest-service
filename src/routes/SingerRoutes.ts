import BaseRoutes from "./BaseRoutes";
import SingerController from "../controllers/SingerController";
import { verifyToken } from "../middlewares/verifyToken";
import { guest } from "../middlewares/guest";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SingerController.getAllSinger);
        this.routes.get("/:id/song/", SingerController.getAllSongsOfSinger);
        this.routes.get("/:id", SingerController.getSingerById);
        this.routes.get("/song/:id", SingerController.getSongById);
    }

}

export default new SingerRoutes().routes;