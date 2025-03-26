import compraDao from '../dao/compra.dao.js'

class CompraService {
  static async registrarCompra (id_proveedor, metodo_pago, observaciones, detalles, total) {
    return await compraDao.registrarCompra(id_proveedor, metodo_pago, observaciones, detalles, total)
  }
}

export default CompraService
