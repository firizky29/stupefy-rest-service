import BaseRoutes from "./BaseRoutes";
import SingerController from "../controllers/SingerController";
import { verifyToken } from "../middlewares/verifyToken";
import { guest } from "../middlewares/guest";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SingerController.getAllSinger);
        this.routes.get("/song/:id", SingerController.getAllSongsOfSinger);
        this.routes.get("/:id", SingerController.getSingerById);
    }

}

export default new SingerRoutes().routes;