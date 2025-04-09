"use client"

import { log } from "@/app/log"
import { useEffect, useState } from "react"

export default function TableProduccion() {

    //  Este es el estado para guardar los datos de la API
    //  y el estado de carga
    const [produccion, setProduccion] = useState([]);
    const [loading, setLoading] = useState(true);
    const noApli = <b>No Aplica</b>; //  Este es el valor que se mostrará en caso de que no haya datos disponibles

    //  Este es el efecto que se ejecuta al cargar el componente y hace la llamada a la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/produccion/");
                if (!response.ok) throw new Error("Error en la respuesta de la API");
                const data = await response.json();
                setProduccion(data); // Guardar los datos en el estado
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
                <h2 className="mb-4">Lista de Produccion</h2>

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
                    // <p>Cargando...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre Queso</th>
                                    <th>Fecha Producción</th>
                                    <th>Cantidad Producida</th>
                                    <th>Peso Total (kg)</th>
                                    <th>Responsable</th>
                                    <th>Estado</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produccion.map((produc, index) => (
                                    <tr key={produc.id_produccion}>
                                        <td>{produc.nombre_queso || noApli}</td>

                                        {/* Aca formateamos la fecha */}
                                        <td>
                                            {
                                                produc.fecha_produccion
                                                    ? new Intl.DateTimeFormat("es-CO", {
                                                        weekday: "long",     // Lunes
                                                        year: "numeric",     // 2025
                                                        month: "long",       // marzo
                                                        day: "numeric",      // 31
                                                        // hour: "numeric",     // 12
                                                        // minute: "numeric",   // 11
                                                        // hour12: true         // p. m.
                                                    }).format(new Date(
                                                        produc.fecha_produccion
                                                    )) : noApli
                                            }
                                        </td>
                                        {/* <td>
                                            {produc.fecha_produccion
                                                ? new Date(produc.fecha_produccion).toLocaleDateString("es-CO")
                                                : noApli}
                                        </td> */}
                                        <td>{produc.cantidad_producida || noApli}</td>
                                        <td>{produc.peso_total_kg || noApli}</td>
                                        <td>{produc.responsable || noApli}</td>
                                        <td>{produc.estado || noApli}</td>
                                        <td>{produc.observaciones || noApli}</td>
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
