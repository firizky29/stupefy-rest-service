import express, { Application } from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { CONST } from "./constants/constant"



class App {
    public app: Application;

    constructor() {
        
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.initDB();
    }

    private setMiddlewares() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(morgan("dev"));
        this.app.use(cors({origin: 'http://localhost:3000', credentials: true}));
        this.app.use(helmet());
        this.app.use(cookieParser());
    }

    private setRoutes() {
        // this.app.use("/api", new Routes(this.app).routes);
    }

    private initDB() {
        // DB.init();
    }

}

const app = new App().app;
app.listen(CONST.PORT, () => {
    console.log(`Server is running on port ${CONST.PORT}`);
});

