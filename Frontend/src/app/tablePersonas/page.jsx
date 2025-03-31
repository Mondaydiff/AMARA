"use client"

import { log } from "@/app/log"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
        <div className="w-full max-w-5xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-4">Lista de Personas</h2>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="w-full max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Apellido</TableHead>
                                <TableHead>Celular</TableHead>
                                <TableHead>Tipo de Persona</TableHead>
                                <TableHead>Edad</TableHead>
                                <TableHead>Direccion</TableHead>
                                <TableHead>Correo Electrónico</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {personas.map((user, index) => (
                                <TableRow key={user.id_persona}>

                                    {/* Contador automatico */}
                                    <TableCell>{index + 1}</TableCell>

                                    <TableCell>{user.nombre}</TableCell>
                                    <TableCell>{user.apellido}</TableCell>
                                    <TableCell>{user.celular}</TableCell>
                                    <TableCell>{user.tipo_persona}</TableCell>
                                    <TableCell>{user.edad}</TableCell>
                                    <TableCell>{user.direccion}</TableCell>
                                    <TableCell>{user.correo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
            }
        </div>
    )
}
