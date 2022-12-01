import BaseRoutes from "./BaseRoutes";
import AuthController from "../controllers/AuthController";
import { verifyToken } from "../middlewares/verifyToken";
import { guest } from "../middlewares/guest";

class SingerRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", [verifyToken], AuthController.getRole);
        this.routes.post("/", [guest], AuthController.login);
        this.routes.post("/create", [guest], AuthController.register);
        this.routes.post("/destroy", [verifyToken], AuthController.logout);
    }
}

export default new SingerRoutes().routes;