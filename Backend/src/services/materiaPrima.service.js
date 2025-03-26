import materiaPrimaDao from '../dao/materiaprima.dao.js'

class MateriaPrimaService {
  static async obtenerMateriasPrimas () {
    return await materiaPrimaDao.obtenerMateriasPrimas()
  }

  static async obtenerIdMateriasPrimas () {
    return await materiaPrimaDao.obtenerIdMateriasPrimas()
  }
}

export default MateriaPrimaService
