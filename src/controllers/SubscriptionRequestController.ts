import { NextFunction, Request, Response } from "express";
import BaseController from "./BaseController";

const soap = require('soap');

// import { createClientAsync } from "soap";

class SubscriptionRequestController extends BaseController {
    getSubscriptionRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const iplocal = "192.168.127.83"; //pake iplocal masing2 pake command ipconfig
            const url = 'http://192.168.127.83:3101/SubscriptionService?wsdl';
            var client = await soap.createClientAsync(url);
            let limit : number;
            let offset : number;
            // if(req.query.limit && typeof req.query.limit === 'string'){
            //     limit = parseInt(req.query.limit,10);
            // } else {
            //     limit = 10;
            // }
            limit = parseInt(req.query.limit as string) || 10;
            offset = parseInt(req.query.offset as string) || 0;
            // if(req.query.offset && typeof req.query.offset === 'string'){
            //     offset = parseInt(req.query.offset,10);
            // } else {
            //     offset = 0;
            // }
            let args = {
                offset: offset,
                limit: limit,
                apiKey: "askdf",
            }
            var result = await client.getRequestsAsync(args);
            console.log(result);
            res.status(200).json(result[0]);
        } catch (error) { 
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    respondRequestSubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = 'http://192.168.127.83:3101/SubscriptionService?wsdl'; // kyknya harus pake local ip masing2 
            var client = await soap.createClientAsync(url);
            console.log(req.body);
            let args = {
                ...req.body
            }
            var result = await client.respondRequestSubsAsync(args);
            console.log(result);
            res.status(200).json(result[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
     }
}

export default new SubscriptionRequestController(); 