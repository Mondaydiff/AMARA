import MateriaPrimaService from '../services/materiaPrima.service.js'

class materiaPrimaController {
  static async obtenerMateriasPrimas (req, res) {
    try {
      const materiaPrimas = await MateriaPrimaService.obtenerMateriasPrimas()
      res.status(201).json(materiaPrimas)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async obtenerIdMateriasPrimas (req, res) {
    try {
      const materiaPrimas = await MateriaPrimaService.obtenerIdMateriasPrimas()
      res.status(200).json(materiaPrimas)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default materiaPrimaController
