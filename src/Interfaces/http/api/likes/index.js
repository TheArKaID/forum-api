import LikesHandler from './handler.js'
import routes from './routes.js'

const name = 'likes'
async function register (server, { container }) {
    const likesHandler = new LikesHandler(container)
    server.route(routes(likesHandler))
}

export default {
    name,
    register
}
