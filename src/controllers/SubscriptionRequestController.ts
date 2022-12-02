import { NextFunction, Request, Response } from "express";
import BaseController from "./BaseController";
import { CONST } from "./../constants/constant";

const soap = require('soap');

// import { createClientAsync } from "soap";

class SubscriptionRequestController extends BaseController {
    getSubscriptionRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip_soap = CONST.SOAP_IP_ADDRESS; //pake iplocal masing2 pake command ipconfig
            const port_soap = CONST.SOAP_PORT;
            // const url = `http://${ip_soap}:3101/SubscriptionService?wsdl`;
            // const url = `http://${CONST.IP_LOCAL}:3101/SubscriptionService?wsdl`;
            const url = `http://${ip_soap}:${port_soap}/SubscriptionService?wsdl`;
            var client = await soap.createClientAsync(url);
            var client1 = await soap.createClientAsync(url);
            let limit : number;
            let offset : number;
            let page: number;
            // if(req.query.limit && typeof req.query.limit === 'string'){
            //     limit = parseInt(req.query.limit,10);
            // } else {
            //     limit = 10;
            // }
            const totalData = await client1.getRequestsAsync({
                offset:0,
                limit:999999999,
                apiKey: CONST.SOAP_API_KEY,
            })
            // const totalData_json = await totalData[0].json();
            let total =0;
            if(totalData[0].RequestResponse) {
            total = totalData[0].RequestResponse.data.length;
            }
            console.log(total);

            limit = parseInt(req.query.limit as string) || 10;
            page = parseInt(req.query.page as string) || 1;
            offset = limit*(page-1);
            // offset = parseInt(req.query.offset as string) || 0;
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
            // res.status(200).json({data: result, total_page: Math.ceil(total/limit), total_subscriptions: result[0].length});
            // res.status(200).json({data: result[0], total_page: Math.ceil(total/limit)});
            res.status(200).json({data: result[0], totalData: totalData[0]});
        } catch (error) { 
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" })
        }
    }

    respondRequestSubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip_soap = CONST.SOAP_IP_ADDRESS; //pake iplocal masing2 pake command ipconfig
            const port_soap = CONST.SOAP_PORT; //pake iplocal masing2 pake command ipconfig
            // const url = `http://${ip_soap}:3101/SubscriptionService?wsdl`; // kyknya harus pake local ip masing2 
            // const url = `http://${CONST.IP_LOCAL}:3101/SubscriptionService?wsdl`; // kyknya harus pake local ip masing2 
            const url = `http://${ip_soap}:${port_soap}/SubscriptionService?wsdl`; // kyknya harus pake local ip masing2 
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