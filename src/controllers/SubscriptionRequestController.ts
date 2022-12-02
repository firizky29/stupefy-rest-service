import { NextFunction, Request, Response } from "express";
import BaseController from "./BaseController";
import { CONST } from "./../constants/constant";

const soap = require('soap');

// import { createClientAsync } from "soap";

class SubscriptionRequestController extends BaseController {
    getSubscriptionRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip_soap = "stupefy-soap-service-server-1"; //pake iplocal masing2 pake command ipconfig
            const iplocal = "192.168.100.120";
            // const url = `http://${ip_soap}:3101/SubscriptionService?wsdl`;
            const url = `http://192.168.100.120:3101/SubscriptionService?wsdl`;
            var client = await soap.createClientAsync(url);
            let limit : number;
            let offset : number;
            let page: number;
            // if(req.query.limit && typeof req.query.limit === 'string'){
            //     limit = parseInt(req.query.limit,10);
            // } else {
            //     limit = 10;
            // }
            const totalData = await client.getRequestsAsync({
                offset:0,
                limit:999999999,
                apiKey: CONST.SOAP_API_KEY,
            })
            const total = totalData[0].length;

            limit = parseInt(req.query.limit as string) || 10;
            page = parseInt(req.query.page as string) || 1;
            offset = limit*(page-1);
            // if(req.query.offset && typeof req.query.offset === 'string'){
            //     offset = parseInt(req.query.offset,10);
            // } else {
            //     offset = 0;
            // }
            let args = {
                offset: offset,
                limit: limit,
                apiKey: CONST.SOAP_API_KEY,
            }
            var result = await client.getRequestsAsync(args);
            console.log(result);
            res.status(200).json({data: result, total_page: Math.ceil(total/limit), total_subscriptions: result[0].length});
        } catch (error) { 
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    respondRequestSubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip_soap = "stupefy-soap-service-server-1"; //pake iplocal masing2 pake command ipconfig
            // const url = `http://${ip_soap}:3101/SubscriptionService?wsdl`; // kyknya harus pake local ip masing2 
            const url = `http://192.168.100.120:3101/SubscriptionService?wsdl`; // kyknya harus pake local ip masing2 
            var client = await soap.createClientAsync(url);
            console.log(req.body);
            let args = {
                ...req.body,
                apiKey: CONST.SOAP_API_KEY,
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