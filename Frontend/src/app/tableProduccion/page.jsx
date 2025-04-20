"use client"

import { log } from "@/app/log"
import { Pencil, Trash, ClipboardPlus } from 'lucide-react';
import { ButtonAction } from "@/components/butons"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

export default function TableProduccion() {
    //  Este es el estado para guardar los datos de la API
    //  y el estado de carga
    const [produccion, setProduccion] = useState([]);

    const [loading, setLoading] = useState(true);

    const noApli = <b>No Aplica</b>; //  Este es el valor que se mostrará en caso de que no haya datos disponibles

    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    const [formData, setFormData] = useState({
        id_queso: "",
        cantidad_producida: "",
        responsable: "",
        observaciones: "",
    }); // Estado para almacenar los datos del formulario

    const [detalles, setDetalles] = useState([
        { materiaPrima: '', cantidad: '', unidad: '' }
    ]);

    const [materiasPrimas, setMateriasPrimas] = useState([]);

    const unidades = ['kg', 'g', 'L', 'ml'];

    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');

    const estados = ['en proceso', 'finalizado', 'cancelado'];

    const [quesos, setQuesos] = useState([]);

    const [idQueso, setIdQueso] = useState('');




    useEffect(() => {
        if (showModal) {
            // Cargar materias primas
            fetch("https://amara-backend-production-2ae0.up.railway.app/api/materia-prima/nombres-id")
                .then(res => res.json())
                .then(data => setMateriasPrimas(data))
                .catch(error => console.error("Error cargando materias primas:", error));

            // Cargar quesos
            fetch("https://amara-backend-production-2ae0.up.railway.app/api/queso")
                .then(res => res.json())
                .then(data => setQuesos(data))
                .catch(error => console.error("Error cargando quesos:", error));
        }
    }, [showModal]);



    //  Este es el efecto que se ejecuta al cargar el componente y hace la llamada a la API
    useEffect(() => {
        fetchData(); // Llamar a la función para obtener los datos al cargar el componente


        //  Este es el intervalo que se ejecuta cada 60 segundos para actualizar los datos de la tabla
        const interval = setInterval(fetchData, 60000); // 60 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, []);



    //  Esta es la función que hace la llamada a la API y guarda los datos en el estado
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


    //  Este es el manejador de eventos para el botón de agregar
    const handleCrear = () => {
        // console.log("Crear nueva produccion");
        // alert("Crear nueva produccion");
        setShowModal(true); // Mostrar el modal
    }


    //  Este es el manejador de eventos para el botón de editar
    const handleEditar = (id) => {
        // console.log(`Eliminar produccion con ID: ${id}`);
        alert(`Eliminar produccion con ID: ${id}`);
    }


    //  Este es el manejador de eventos para el botón de eliminar
    const handleEliminar = async (id) => {
        // console.log(`Eliminar produccion con ID: ${id}`);
        // alert(`Eliminar produccion con ID: ${id}`);

        const result = await Swal.fire({
            title: `¿Estás seguro? ${id}`,
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {

            try {
                //  Aqui se hace la llamada a la API para eliminar el registro
                const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/produccion/${id}`, {
                    method: 'DELETE',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                });

                if (res.ok) {
                    Swal.fire(
                        'Eliminado!',
                        'La producción ha sido eliminada.',
                        'success'
                    );

                    fetchData(); // Actualizar la tabla después de eliminar

                } else {
                    Swal.fire(
                        'Error!',
                        'No se pudo eliminar la producción.',
                        'error'
                    );
                }

            } catch (error) {
                console.error(`Hubo un error ${error}`);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al conectar con el servidor.',
                    'error'
                );
            }
        }
    }


    //  Este es el manejador de eventos para el botón de guardar
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // Este es el manejador de eventos para el botón de agregar detalle
    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;
        setDetalles(nuevosDetalles);
    };

    // Este es el manejador de eventos para el botón de agregar detalle
    const agregarDetalle = () => {
        setDetalles([...detalles, { materiaPrima: '', cantidad: '', unidad: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        console.log("Datos del formulario:", formData); // Verifica los datos del formulario

        const response = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/produccion/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Convertir el objeto a JSON
        });

        if (!response.ok) {
            console.error("Error en la respuesta de la API");
            return;
        }

        const data = await response.json();
        console.log("Respuesta de la API:", data); // Verifica la respuesta de la API

        setShowModal(false); // Cerrar el modal después de enviar el formulario
        setFormData({ // Limpiar el formulario después de enviar
            id_queso: "",
            cantidad_producida: "",
            responsable: "",
            estado: '',
            observaciones: "",
            detalles: [
                {
                    id_materia: "",
                    cantidad_usada: "",
                    unidad_medida: "",
                }
            ]
        });

        fetchData(); // Actualizar la tabla después de enviar el formulario
    }

    const eliminarDetalle = (index) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };


    log();
    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Lista de Produccion</h2>
                <p className="text-muted">Esta es la lista de produccion de quesos</p>

                <div className="d-flex justify-content-end mb-3">
                    <ButtonAction onClick={() => handleCrear()} text=" Crear Producto" icon={ClipboardPlus} color="primary" style={{ margin: "5px", marginRight: "10px" }} />
                </div>


                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar Producción</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Queso</Form.Label>
                                <Form.Select
                                    required
                                    value={idQueso} // este valor debe estar en un estado también, como useState('')
                                    onChange={(e) => setIdQueso(e.target.value)}
                                >
                                    <option value="">Seleccione un queso</option>
                                    {quesos.map((queso) => (
                                        <option key={queso.id} value={queso.id}>
                                            {queso.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Cantidad Producida</Form.Label>
                                <Form.Control type="number" placeholder="Cantidad producida" required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Responsable</Form.Label>
                                <Form.Control type="text" placeholder="Responsable" required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    required
                                    value={estadoSeleccionado}
                                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    {estados.map((state, index) => (
                                        <option key={index} value={state}>{state}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>


                            <Form.Group className="mb-3">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control type="text" placeholder="Observaciones" required />
                            </Form.Group>

                            <h5>Detalles de Materia Prima</h5>
                            {detalles.map((detalle, index) => (
                                <div key={index} className="mb-3 border rounded p-3 position-relative">
                                    {/* Botón "X" para eliminar */}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-2"
                                        onClick={() => eliminarDetalle(index)}
                                    >
                                        X
                                    </Button>

                                    <Row className="mb-2">
                                        <Col md={4}>
                                            <Form.Label>Materia prima</Form.Label>
                                            <Form.Select
                                                required
                                                value={detalle.materiaPrima}
                                                onChange={(e) => handleDetalleChange(index, 'materiaPrima', e.target.value)}
                                            >
                                                <option value="">Seleccione</option>
                                                {materiasPrimas.map((mp) => (
                                                    <option key={mp.id} value={mp.id}>
                                                        {mp.nombre}
                                                    </option>
                                                ))}
                                            </Form.Select>

                                        </Col>

                                        <Col md={4}>
                                            <Form.Label>Cantidad usada</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min={0}
                                                required
                                                value={detalle.cantidad}
                                                onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Form.Label>Unidad de medida</Form.Label>
                                            <Form.Select
                                                required
                                                value={detalle.unidad}
                                                onChange={(e) => handleDetalleChange(index, 'unidad', e.target.value)}
                                            >
                                                <option value="">Seleccione</option>
                                                {unidades.map((unidad, i) => (
                                                    <option key={i} value={unidad}>{unidad}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <Button variant="secondary" onClick={agregarDetalle} className="mb-3">
                                Agregar otro detalle
                            </Button>

                            <div className="d-grid">
                                <Button type="submit" variant="primary">Guardar Producción</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>


                {loading ? (
                    <div className="table-responsive">
                        <table className="table text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre Queso</th>
                                    <th>Fecha Producción</th>
                                    <th>Cantidad Producida</th>
                                    <th>Peso Total (kg)</th>
                                    <th>Responsable</th>
                                    <th>Estado</th>
                                    <th>Observaciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 8 }).map((_, index) => (
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
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produccion.map((produc) => (
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


                                        <td className="d-flex  ">
                                            <ButtonAction onClick={() => handleEditar(produc.id_produccion)} icon={Pencil} color="primary" style={{ margin: "5px" }} />
                                            <ButtonAction onClick={() => handleEliminar(produc.id_produccion)} icon={Trash} color="danger" style={{ margin: "5px" }} />
                                        </td>
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
