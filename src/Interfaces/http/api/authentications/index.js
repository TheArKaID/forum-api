import routes from './routes.js'
import AuthenticationsHandler from './handler.js'

const name = 'authentications'
async function register (server, { container }) {
    const authenticationsHandler = new AuthenticationsHandler(container)
    server.route(routes(authenticationsHandler))
}

export default {
    name,
    register
}
