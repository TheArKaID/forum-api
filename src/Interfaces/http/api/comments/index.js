import CommentsHandler from './handler.js'
import routes from './routes.js'

const name = 'comments'
async function register (server, { container }) {
    const commentsHandler = new CommentsHandler(container)
    server.route(routes(commentsHandler))
}

export default {
    name,
    register
}
