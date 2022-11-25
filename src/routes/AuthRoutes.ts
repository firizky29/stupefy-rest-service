import BaseRoutes from "./BaseRoutes";
import AuthController from "../controllers/AuthController";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.post("/", AuthController.register);
    }
}

export default new SingerRoutes().routes;