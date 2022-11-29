import BaseRoutes from "./BaseRoutes";
import SubscriptionRequestController from "../controllers/SubscriptionRequestController";

class SubscriptionRequestRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", SubscriptionRequestController.getSubscriptionRequests);
        this.routes.post("/respond", SubscriptionRequestController.respondRequestSubs);
    }
}

export default new SubscriptionRequestRoutes().routes;