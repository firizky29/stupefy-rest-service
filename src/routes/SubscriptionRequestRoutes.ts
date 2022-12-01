import BaseRoutes from "./BaseRoutes";
import SubscriptionRequestController from "../controllers/SubscriptionRequestController";

import { verifyToken } from "../middlewares/verifyToken";
import { admin } from "../middlewares/admin";

class SubscriptionRequestRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", [verifyToken, admin], SubscriptionRequestController.getSubscriptionRequests);
        this.routes.post("/respond", [verifyToken, admin], SubscriptionRequestController.respondRequestSubs);
    }
}

export default new SubscriptionRequestRoutes().routes;