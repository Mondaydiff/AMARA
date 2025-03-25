import { dbConnect } from '../config/conenectionSQLServer.js'

class materiaPrimaDao {
  static async obtenerMateriasPrimas () {
    const pool = await dbConnect
    const result = await pool.request().query('SELECT * FROM materia_prima')
    return result.recordset
  }

  static async obtenerIdMateriasPrimas () {
    const pool = await dbConnect
    const result = await pool.request().query('SELECT id_materia, nombre FROM materia_prima')
    console.log(result.recordset)
    return result.recordset
  }
}

export default materiaPrimaDao
