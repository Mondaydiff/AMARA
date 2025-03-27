import { dbConnect, mssql } from '../config/conenectionSQLServer.js'
/* eslint-disable camelcase */
class compraDao {
  static async registrarCompra (cedula_proveedor, metodo_pago, observaciones, detalles, total) {
    try {
      const pool = await dbConnect

      // Insertar la compra
      const result = await pool
        .request()
        .input('cedula_proveedor', mssql.NVarChar, cedula_proveedor)
        .input('metodo_pago', mssql.VarChar, metodo_pago)
        .input('observaciones', mssql.NVarChar, observaciones)
        .input('total', mssql.Decimal, total)
        .execute('sp_insertar_compra')

      const id_compra = result.recordset[0].id_compra_creada

      // Validar que todas las materias primas existan
      for (const detalle of detalles) {
        const materiaResult = await pool
          .request()
          .input('id_materia', mssql.Int, detalle.id_materia)
          .query('SELECT COUNT(*) AS existe FROM materia_prima WHERE id_materia = @id_materia')

        if (materiaResult.recordset[0].existe === 0) {
          return {
            success: false,
            message: `Error: La materia prima con ID ${detalle.id_materia} no existe`
          }
        }
      }

      // Insertar los detalles de la compra
      for (const detalle of detalles) {
        await pool
          .request()
          .input('id_compra', mssql.Int, id_compra)
          .input('id_materia', mssql.Int, detalle.id_materia)
          .input('cantidad', mssql.Decimal, detalle.cantidad)
          .input('precio_unitario', mssql.Decimal, detalle.precio_unitario)
          .query(
            `INSERT INTO detalles_compra (id_compra, id_materia, cantidad, precio_unitario) 
            VALUES (@id_compra, @id_materia, @cantidad, @precio_unitario)`
          )
      }

      return { success: true, message: 'Compra registrada correctamente', id_compra }
    } catch (error) {
      console.error('Error al registrar la compra:', error.message)
      return { success: false, message: `Error al registrar la compra: ${error.message}` }
    }
  }
}

export default compraDao
