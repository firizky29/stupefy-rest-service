import BaseRoutes from "./BaseRoutes";
import SingerController from "../controllers/SingerController";
import { verifyToken } from "../middlewares/verifyToken";
import { admin } from "../middlewares/admin";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", [verifyToken, admin], SingerController.getAllSinger);
        this.routes.get("/:id", [verifyToken, admin], SingerController.getAllSongsOfSinger);
    }
    
}

export default new SingerRoutes().routes;