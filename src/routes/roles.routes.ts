import { Router } from 'express'
import RolesController from '../controllers/roles.controller'

const router = Router()
/* Creating a new instance of the RolesController class. */
const rol = RolesController

router.get("/", rol.listRoles)
router.post("/", rol.createRoles)
router.get("/:id", rol.byIdRol)
router.put("/:id", rol.updateRol)
router.delete("/:id", rol.deleteRol)


export default router
