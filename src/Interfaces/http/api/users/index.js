import UsersHandler from './handler.js'
import routes from './routes.js'

const name = 'users'
async function register (server, { container }) {
    const usersHandler = new UsersHandler(container)
    server.route(routes(usersHandler))
}

export default {
    name,
    register
}
