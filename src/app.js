import * as dotenv from 'dotenv'
import createServer from './Infrastructures/http/createServer.js'
import container from './Infrastructures/container.js';

(async () => {
    dotenv.config()
    const server = await createServer(container)
    await server.start()
    console.log(`server start at ${server.info.uri}`)
})()
