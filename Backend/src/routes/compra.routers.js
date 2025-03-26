import { Router } from 'express'
import compraController from '../controllers/compra.controller.js'

const router = Router()

router.post('/', compraController.registrarCompra)

export default router
