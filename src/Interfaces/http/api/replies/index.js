import RepliesHandler from './handler.js'
import routes from './routes.js'

const name = 'replies'
async function register (server, { container }) {
    const repliesHandler = new RepliesHandler(container)
    server.route(routes(repliesHandler))
}

export default {
    name,
    register
}
