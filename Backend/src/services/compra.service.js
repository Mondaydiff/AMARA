import compraDao from '../dao/compra.dao.js'
/* eslint-disable camelcase */
class CompraService {
  static async registrarCompra (cedula_proveedor, metodo_pago, observaciones, detalles, total) {
    return await compraDao.registrarCompra(cedula_proveedor, metodo_pago, observaciones, detalles, total)
  }
}

export default CompraService
