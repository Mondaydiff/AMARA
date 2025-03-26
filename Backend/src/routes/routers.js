import express from 'express'
import personaRouters from './persona.routers.js'
import authRoutes from './auth.routes.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import createClientProveedor from './createCliente_proveedor.router.js'
import materiaPrimaRouters from './materiaPrima.routers.js'
import compraRouters from './compra.routers.js'
const router = express.Router()

router.use('/personas', personaRouters)
router.use('/', authRoutes)
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user })
})
router.use('/cliente', createClientProveedor)
router.use('/proveedor', createClientProveedor)
router.use('/materias-primas', materiaPrimaRouters)
router.use('/compra', compraRouters)

export default router
