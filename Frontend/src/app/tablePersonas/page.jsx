"use client"

import { log } from "@/app/log"
import { useEffect, useState } from "react"

export default function TablePersonas() {
    // Datos de ejemplo (puedes cambiarlo por datos de una API)
    // const [data, setData] = useState([
    //     { id: 1, nombre: "Juan Pérez", correo: "juan@example.com" },
    //     { id: 2, nombre: "María López", correo: "maria@example.com" },
    //     { id: 3, nombre: "Carlos Gómez", correo: "carlos@example.com" }
    // ])


    //  Este es el estado para guardar los datos de la API
    //  y el estado de carga
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const noApli = <b>No Aplica</b>; //  Este es el valor que se mostrará en caso de que no haya datos disponibles

    //  Este es el efecto que se ejecuta al cargar el componente y hace la llamada a la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/personas/");
                if (!response.ok) throw new Error("Error en la respuesta de la API");
                const data = await response.json();
                setPersonas(data); // Guardar los datos en el estado
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setLoading(false); // Cambiar el estado de carga
            }
        }

        fetchData();

        //  Este es el intervalo que se ejecuta cada 60 segundos para actualizar los datos de la tabla
        const interval = setInterval(fetchData, 60000); // 60 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente

    }, []);

    log();
    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Lista de Personas</h2>

                {loading ? (
                    <div className="table-responsive">
                        <table className="table text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Celular</th>
                                    <th>Tipo de Persona</th>
                                    <th>Edad</th>
                                    <th>Dirección</th>
                                    <th>Correo Electrónico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <td key={i}>
                                                <div className="placeholder-glow">
                                                    <span className="placeholder col-12"></span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    // <div className="text-center"><div className="spinner-border" role="status"></div></div>
                    // <p>Cargando...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Celular</th>
                                    <th>Tipo de Persona</th>
                                    <th>Edad</th>
                                    <th>Dirección</th>
                                    <th>Correo Electrónico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personas.map((user, index) => (
                                    <tr key={user.id_persona}>
                                        <td>{index + 1}</td>
                                        <td>{user.nombre || noApli}</td>
                                        <td>{user.apellido || noApli}</td>
                                        <td>{user.celular || noApli}</td>
                                        <td>{user.tipo_persona || noApli}</td>
                                        <td>{user.edad || noApli}</td>
                                        <td>{user.direccion || noApli}</td>
                                        <td>{user.correo || noApli}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
