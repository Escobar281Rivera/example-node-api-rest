import dotenv from 'dotenv'
import { Router } from 'express'
import routerRol from './roles.routes'
import routerUser from './users.routes'

dotenv.config()
const URL = process.env.URL

const routes = Router()

routes.use(`${URL}/rol`, routerRol)
routes.use(`${URL}/user`, routerUser)

export default routes
