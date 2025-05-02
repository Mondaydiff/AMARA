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

    const estados = ['finalizado', 'cancelado'];

    const [quesos, setQuesos] = useState([]);

    const [idQueso, setIdQueso] = useState('');

    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEdicion, setIdEdicion] = useState(null);





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
        setModoEdicion(false);
        setIdEdicion(null);
        setFormData({
            id_queso: "",
            cantidad_producida: "",
            responsable: "",
            estado: "",
            observaciones: "",
        });
        setDetalles([{ materiaPrima: '', cantidad: '', unidad: '' }]);
        setShowModal(true);
    };



    //  Este es el manejador de eventos para el botón de editar
    const handleEditar = async (id) => {
        try {
            const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/produccion/${id}`);

            const data = await res.json();
            const response = data[0]
            setFormData({
                id_queso: response.id_queso,
                cantidad_producida: response.cantidad_producida,
                responsable: response.responsable,
                estado: response.estado,
                observaciones: response.observaciones,
            });

            // setDetalles(response.detalles.map(d => ({
            //     materiaPrima: d.id_materia,
            //     cantidad: d.cantidad_usada,
            //     unidad: d.unidad_medida
            // })));

            setModoEdicion(true);
            setIdEdicion(id);
            setShowModal(true);
        } catch (error) {
            console.error("Error al cargar la producción:", error);
            Swal.fire("Error", "No se pudo cargar la producción para editar", "error");
        }
    };



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

        // Convertir a número si es cantidad_producida o id_queso
        const parsedValue = ["cantidad_producida", "id_queso"].includes(name)
            ? parseInt(value)
            : value;

        setFormData({ ...formData, [name]: parsedValue });
    };


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
        e.preventDefault();
        const payload = {
            ...formData,
            id_queso: parseInt(formData.id_queso),
            detalles: detalles.map((d) => ({
                id_materia: parseInt(d.materiaPrima),
                cantidad_usada: parseFloat(d.cantidad),
                unidad_medida: d.unidad,
            })),
        };

        try {
            const url = modoEdicion
                ? `https://amara-backend-production-2ae0.up.railway.app/api/produccion/${idEdicion}`
                : "https://amara-backend-production-2ae0.up.railway.app/api/produccion/create";

            const method = modoEdicion ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                Swal.fire("Error", "No se pudo guardar la producción", "error");
                return;
            }

            Swal.fire("Éxito", modoEdicion ? "Producción actualizada" : "Producción registrada", "success");

            // Reset y cerrar modal
            setFormData({ id_queso: "", cantidad_producida: "", responsable: "", estado: "", observaciones: "" });
            setDetalles([{ materiaPrima: '', cantidad: '', unidad: '' }]);
            setShowModal(false);
            fetchData();

        } catch (error) {
            console.error("Error al enviar los datos:", error);
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
        }
    };



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
                        <Modal.Title>{modoEdicion ? "Editar Producción" : "Registrar Producción"}</Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Queso</Form.Label>
                                {modoEdicion ? (
                                    <Form.Select
                                        disabled
                                        name="id_queso"
                                        value={formData.id_queso}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione un queso</option>
                                        {quesos.map((queso) => (
                                            <option key={queso.id_queso} value={queso.id_queso}>
                                                {queso.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Select
                                        required
                                        name="id_queso"
                                        value={formData.id_queso}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione un queso</option>
                                        {quesos.map((queso) => (
                                            <option key={queso.id_queso} value={queso.id_queso}>
                                                {queso.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}

                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Cantidad Producida</Form.Label>
                                <Form.Control type="number"
                                    placeholder="Cantidad producida"
                                    required
                                    name="cantidad_producida"
                                    value={formData.cantidad_producida}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Responsable</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Responsable"
                                    required
                                    name="responsable"
                                    value={formData.responsable}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                {modoEdicion ? (
                                    <Form.Select
                                        required
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione</option>
                                        {estados.map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        name="estado"
                                        value={formData.estado = 'en proceso'}
                                        disabled
                                        onChange={handleChange}
                                    />
                                )}
                            </Form.Group>



                            <Form.Group className="mb-3">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Observaciones"
                                    required
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                />
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
                                                    <option key={mp.id_materia} value={mp.id_materia}>
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
