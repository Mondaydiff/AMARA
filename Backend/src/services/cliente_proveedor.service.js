import CreateClienteProveedorDao from '../dao/cliente_proveedor.dao.js'
/* eslint-disable camelcase */
class Cliente_proveedorService {
  static async create (cedula_nit, nombre, apellido, celular, tipo_persona, edad, direccion, correo, tipo_relacion) {
    return await CreateClienteProveedorDao.create(cedula_nit, nombre, apellido, celular, tipo_persona, edad, direccion, correo, tipo_relacion)
  }
}

export default Cliente_proveedorService
