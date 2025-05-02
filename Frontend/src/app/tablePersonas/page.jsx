"use client"

import { useEffect, useState } from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import { Pencil, ClipboardPlus, Trash } from "lucide-react";
import { ButtonAction } from "@/components/butons";
import Swal from "sweetalert2";

export default function TablePersonas() {
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEdicion, setIdEdicion] = useState(null);

    const [formData, setFormData] = useState({
        cedula_nit: "",
        nombre: "",
        apellido: "",
        celular: "",
        tipo_persona: "natural",
        edad: "",
        direccion: "",
        correo: "",
        tipo_relacion: "cliente"
    });

    const noApli = <b>No Aplica</b>;

    const fetchData = async () => {
        try {
            const res = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/personas/");
            const data = await res.json();
            setPersonas(data);
        } catch (error) {
            console.error("Error al obtener personas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleCrear = () => {
        setModoEdicion(false);
        setFormData({
            cedula_nit: "",
            nombre: "",
            apellido: "",
            celular: "",
            tipo_persona: "natural",
            edad: "",
            direccion: "",
            correo: "",
            tipo_relacion: "cliente"
        });
        setShowModal(true);
    };

    const handleEditar = async (id) => {
        try {
            const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/personas/${id}`);
            const persona = await res.json();

            setFormData({
                cedula_nit: persona.cedula_nit || "",
                nombre: persona.nombre || "",
                apellido: persona.apellido || "",
                celular: persona.celular || "",
                tipo_persona: persona.tipo_persona || "natural",
                edad: persona.edad || "",
                direccion: persona.direccion || "",
                correo: persona.correo || "",
                tipo_relacion: persona.tipo_relacion || "cliente"
            });

            setModoEdicion(true);
            setIdEdicion(id);
            setShowModal(true);
        } catch (err) {
            console.error("Error al cargar persona:", err);
            Swal.fire("Error", "No se pudo cargar la persona", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.cedula_nit || !formData.nombre || !formData.celular || !formData.direccion || !formData.correo) {
            Swal.fire("Campos requeridos", "Por favor completa todos los campos obligatorios.", "warning");
            return;
        }

        if (!modoEdicion) {
            if (formData.tipo_persona === "natural") {
                if (!formData.apellido || !formData.edad) {
                    Swal.fire("Campos requeridos", "Apellido y edad son obligatorios para personas naturales.", "warning");
                    return;
                }
            }
        }

        try {
            let res;

            if (modoEdicion) {
                // Solo envía los campos modificables
                const payload = {
                    direccion: formData.direccion,
                    celular: formData.celular,
                    correo: formData.correo,
                    nombre: formData.nombre,
                    apellido: formData.tipo_persona === "natural" ? formData.apellido : null,
                    edad: formData.tipo_persona === "natural" ? parseInt(formData.edad) : null,
                };

                res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/personas/${idEdicion}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                // Crear
                const endpoint =
                    formData.tipo_relacion === "cliente"
                        ? "https://amara-backend-production-2ae0.up.railway.app/api/cliente/create"
                        : "https://amara-backend-production-2ae0.up.railway.app/api/proveedor/create";

                const payload = {
                    cedula_nit: formData.cedula_nit,
                    nombre: formData.nombre,
                    apellido: formData.tipo_persona === "juridica" ? null : formData.apellido,
                    celular: formData.celular,
                    tipo_persona: formData.tipo_persona,
                    edad: formData.tipo_persona === "juridica" ? null : parseInt(formData.edad),
                    direccion: formData.direccion,
                    correo: formData.correo,
                    tipo_relacion: formData.tipo_relacion
                };

                res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) throw new Error("Error en la solicitud");

            Swal.fire("Éxito", modoEdicion ? "Persona actualizada correctamente" : "Persona registrada correctamente", "success");
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error en el envío:", err);
            Swal.fire("Error", modoEdicion ? "No se pudo actualizar la persona" : "No se pudo guardar la persona", "error");
        }
    };

    const handleEliminar = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la persona de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/personas/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            Swal.fire("Eliminado", "La persona ha sido eliminada correctamente.", "success");
            fetchData(); // Actualiza la lista
        } catch (err) {
            console.error("Error al eliminar persona:", err);
            Swal.fire("Error", "No se pudo eliminar la persona.", "error");
        }
    };




    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Lista de Personas</h2>

                <div className="d-flex justify-content-end mb-3">
                    <ButtonAction onClick={handleCrear} text=" Crear Persona" icon={ClipboardPlus} color="primary" />
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{modoEdicion ? "Editar Persona" : "Registrar Persona"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            {!modoEdicion && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Select name="tipo_relacion" value={formData.tipo_relacion} onChange={handleChange} required>
                                            <option value="cliente">Cliente</option>
                                            <option value="proveedor">Proveedor</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Tipo de Persona</Form.Label>
                                        <Form.Select name="tipo_persona" value={formData.tipo_persona} onChange={handleChange} required>
                                            <option value="natural">Natural</option>
                                            <option value="juridica">Jurídica</option>
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Cédula/NIT</Form.Label>
                                {modoEdicion ? (
                                    <Form.Control disabled type="text" name="cedula_nit" value={formData.cedula_nit} onChange={handleChange} required />
                                ) : (
                                    <Form.Control type="text" name="cedula_nit" value={formData.cedula_nit} onChange={handleChange} required />
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </Form.Group>

                            {formData.tipo_persona === "natural" && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            required={!modoEdicion ? true : false}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Edad</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="edad"
                                            value={formData.edad}
                                            onChange={handleChange}
                                            required={!modoEdicion ? true : false}
                                        />
                                    </Form.Group>
                                </>
                            )}


                            <Form.Group className="mb-3">
                                <Form.Label>Celular</Form.Label>
                                <Form.Control type="text" name="celular" value={formData.celular} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" variant="primary">Guardar Persona</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                <div className="table-responsive">
                    <table className="table table-striped text-center">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Cédula/NIT</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Celular</th>
                                <th>Tipo</th>
                                <th>Edad</th>
                                <th>Dirección</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 10 }).map((_, j) => (
                                            <td key={j}><div className="placeholder-glow"><span className="placeholder col-12"></span></div></td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                personas.map((p, index) => (
                                    <tr key={p.id_persona}>
                                        <td>{index + 1}</td>
                                        <td>{p.cedula_nit || noApli}</td>
                                        <td>{p.nombre || noApli}</td>
                                        <td>{p.apellido || noApli}</td>
                                        <td>{p.celular || noApli}</td>
                                        <td>{p.tipo_persona || noApli}</td>
                                        <td>{p.edad || noApli}</td>
                                        <td>{p.direccion || noApli}</td>
                                        <td>{p.correo || noApli}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <ButtonAction onClick={() => handleEditar(p.id_persona)} icon={Pencil} color="primary" />
                                                <ButtonAction onClick={() => handleEliminar(p.id_persona)} icon={Trash} color="danger" />
                                            </div>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
