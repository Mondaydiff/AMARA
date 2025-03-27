# 📌 API REST - Backend Proyecto

Este documento proporciona detalles sobre la API REST desarrollada para la gestión del proyecto, incluyendo endpoints, configuración del entorno, y scripts necesarios para ejecutar el backend.

---

## 🚀 Instalación y Configuración

### 📌 Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior)
- **npm**
- **SQL Server** (para la base de datos)

### 📥 Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Acceder al directorio del proyecto:
   ```bash
   cd Backend
   ```
3. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
4. Crear un archivo `.env` en la raíz del proyecto y configurar las variables de entorno necesarias:
   ```env
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_SERVER=localhost
   DB_DATABASE=nombre_base_datos
   JWT_SECRET=contraseña_para_verificar_token
   ```

### ▶️ Ejecución del Proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para ejecutar en producción:

```bash
npm start
```

---

## 📌 Documentacion de la api

```
https://amara-backend-production-2ae0.up.railway.app/doc/
```

---

## 📦 Scripts Disponibles

En el archivo `package.json` existen los siguientes scripts útiles:

- `npm run dev`: Ejecuta el servidor en modo desarrollo.
- `npm start`: Inicia el servidor en modo producción.
- `npm install`: Instala todas las dependencias necesarias.
- `npm run lint`: Ejecuta el linter para verificar el código.
- `npm run lint:fix`: Corrige automáticamente los errores detectados por el linter.

---

## 🛠 Tecnologías Usadas

- **Node.js** + **Express** para la API REST.
- **MSSQL** como base de datos.
- **dotenv** para manejo de variables de entorno.
- **jsonwebtoken (JWT)** para autenticación segura.

---

## 🤝 Contribución

para la contribuir al proyecto, por favor sigue estas reglas:

1. Crea una nueva rama con tu feature: `git checkout -b feature-nueva`.
2. Realiza los cambios y haz commit: `git commit -m "Descripción de los cambios"`.
3. Sube los cambios: `git push origin feature-nueva`.
4. Realiza un **Pull Request**.

---
