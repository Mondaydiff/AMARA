/* eslint-disable camelcase */
import Cliente_proveedorService from '../services/cliente_proveedor.service.js'

export const create = async (req, res) => {
  try {
    const { cedula_nit, nombre, apellido, celular, tipo_persona, edad, direccion, correo, tipo_relacion } = req.body

    if (!cedula_nit || !nombre || !celular || !tipo_persona || !direccion || !correo || !tipo_relacion) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' })
    }
    const response = await Cliente_proveedorService.create(cedula_nit, nombre, apellido, celular, tipo_persona, edad, direccion, correo, tipo_relacion)

    if (response.success) {
      return res.status(201).json({ message: response.message })
    } else {
      return res.status(500).json({ Error: response.message })
    }
  } catch (error) {
    return res.status(500).json({ Error: 'Error del servidor' })
  }
}
