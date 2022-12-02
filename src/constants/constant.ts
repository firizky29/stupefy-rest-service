import "dotenv/config";

export const CONST = {
    PORT: process.env.PORT || 3100,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    SOAP_API_KEY: process.env.SOAP_API_KEY,
    SOAP_IP_ADDRESS: process.env.SOAP_IP_ADDRESS,
    SOAP_PORT: process.env.SOAP_PORT
}