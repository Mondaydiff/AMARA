import { Router } from 'express'
import materiaPrimaController from '../controllers/materiaPrima.controller.js'

const router = Router()

router.get('/', materiaPrimaController.obtenerMateriasPrimas)
router.get('/nombres-id', materiaPrimaController.obtenerIdMateriasPrimas)

export default router
