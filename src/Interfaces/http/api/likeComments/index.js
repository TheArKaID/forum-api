import LikeCommentsHandler from './handler.js'
import routes from './routes.js'

const name = 'like'
async function register (server, { container }) {
    const likeCommentsHandler = new LikeCommentsHandler(container)
    server.route(routes(likeCommentsHandler))
}

export default {
    name,
    register
}
