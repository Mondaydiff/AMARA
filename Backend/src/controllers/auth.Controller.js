/* eslint-disable camelcase */
import jwt from 'jsonwebtoken'
import { getUserByUsername } from '../dao/usuario.dao.js'

export const login = async (req, res) => {
  try {
    const { nombre_usuario, password } = req.body

    // validamos que se enviaron usuario y contraseña
    if (!nombre_usuario || !password) {
      return res.status(400).json({ messaje: 'usuario y contraseña son requeridos' })
    }

    // Buscar usuario en la base de datos
    const user = await getUserByUsername(nombre_usuario)
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    // Comparar la contraseña
    if (password !== user.password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id_usuario, username: user.nombre_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ message: 'Login exitoso', token })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}
