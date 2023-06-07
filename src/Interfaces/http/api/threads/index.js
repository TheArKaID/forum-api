import ThreadsHandler from './handler.js'
import routes from './routes.js'

const name = 'threads'
async function register (server, { container }) {
    const threadsHandler = new ThreadsHandler(container)
    server.route(routes(threadsHandler))
}

export default {
    name,
    register
}
