import { dbConnect, mssql } from '../config/conenectionSQLServer.js'

class compraDao {
  static async registrarCompra (id_proveedor, metodo_pago, observaciones, detalles, total) {
    try {
      // Validar que el total sea correcto antes de proceder

      // Conectar a la base de datos
      const pool = await dbConnect

      // Insertar la compra
      const result = await pool
        .request()
        .input('id_proveedor', mssql.Int, id_proveedor)
        .input('metodo_pago', mssql.VarChar, metodo_pago)
        .input('observaciones', mssql.NVarChar, observaciones)
        .input('total', mssql.Decimal, total)
        .execute('sp_insertar_compra')

      const id_compra = result.recordset[0].id_compra_creada // ID generado

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
      throw new Error(`Error al registrar la compra: ${error.message}`)
    }
  }
}

export default compraDao
