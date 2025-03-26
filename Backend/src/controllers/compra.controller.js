import CompraService from '../services/compra.service.js'

class compraController {
  static async registrarCompra (req, res) {
    try {
      const { id_proveedor, metodo_pago, observaciones, detalles } = req.body

      if (!id_proveedor || !metodo_pago || !detalles || !observaciones) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' })
      }
      const total = detalles.reduce((sum, detalle) =>
        sum + (detalle.cantidad * detalle.precio_unitario), 0
      )

      const response = await CompraService.registrarCompra(id_proveedor, metodo_pago, observaciones, detalles, total)

      if (response.success) {
        return res.status(201).json({ message: response.message })
      } else {
        return res.status(500).json({ Error: response.message })
      }
    } catch (error) {
      return res.status(500).json({ Error: 'Error del servidor' })
    }
  }
}

export default compraController
