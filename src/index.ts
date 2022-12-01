import express, { Application } from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { CONST } from "./constants/constant"

import SongRoutes from "./routes/SongRoutes"
import SingerRoutes from "./routes/SingerRoutes"
import AuthRoutes from "./routes/AuthRoutes"
import SubscriptionRequestRoutes from "./routes/SubscriptionRequestRoutes"



class App {
    public app: Application;

    constructor() {
        
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
    }

    private setMiddlewares() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(morgan("dev"));
        this.app.use(cors({origin: ['http://localhost:3000', 'http://localhost:8080'], credentials: true}));
        this.app.use(helmet({
            crossOriginResourcePolicy: false,
          }));
        this.app.use(cookieParser());
    }

    private setRoutes() {
        // this.app.use("/api", new Routes(this.app).routes);
        this.app.use("/api/v1/singer", SingerRoutes);
        this.app.use("/api/v1/song", SongRoutes);
        this.app.use("/api/v1/auth", AuthRoutes);
        this.app.use("/api/v1/subscription-request", SubscriptionRequestRoutes);        
    }


}

const app = new App().app;
app.listen(CONST.PORT, () => {
    console.log(`Server is running on port ${CONST.PORT}`);
});

