import BaseRoutes from "./BaseRoutes";
import SingerController from "../controllers/SingerController";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SingerController.getAllSinger);
        this.routes.get("/:id", SingerController.getAllSongsOfSinger);
    }
}

export default new SingerRoutes().routes;