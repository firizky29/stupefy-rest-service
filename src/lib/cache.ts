import * as redis from 'redis'

let client : redis.RedisClientType | null = null;

export async function getClient() : Promise<redis.RedisClientType> {
    if(!client){
        client = redis.createClient({
            socket: {
                host: 'redis',
                port: 6379
            }
        });

        client.on('error', err => {
            console.log('Error : ' + err);
        });
        
        await client.connect();
    }

    return client;
};