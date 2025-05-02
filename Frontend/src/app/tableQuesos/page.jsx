"use client"

import { useEffect, useState } from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import { Pencil, ClipboardPlus, Trash } from "lucide-react";
import { ButtonAction } from "@/components/butons";
import Swal from "sweetalert2";

export default function TableQuesos() {
  const [quesos, setQuesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    precio: 0,
    cantidad_disponible: 0,
    ubicacion: ""
  });

  const noApli = <b>No Aplica</b>;

  const fetchData = async () => {
    try {

      const res = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/queso");
      const data = await res.json();
      setQuesos(data);


    } catch (error) {
      console.error("Error al obtener quesos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Considera si necesitas auto-refresco
    //return () => clearInterval(interval);
  }, []);

  const handleCrear = () => {
    setModoEdicion(false);
    setFormData({
      nombre: "",
      tipo: "",
      precio: 0,
      cantidad_disponible: 0,
      ubicacion: ""
    });
    setShowModal(true);
  };

  const handleEditar = async (id) => {
    try {

      const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/queso/${id}`);
      const queso = await res.json();
      setFormData({ ...queso[0] });
      setModoEdicion(true);
      setIdEdicion(id);
      setShowModal(true);


    } catch (err) {
      console.error("Error al cargar queso:", err);
      Swal.fire("Error", "No se pudo cargar el queso", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica (¡ajusta según tus necesidades!)
    if (!formData.nombre || !formData.tipo || !formData.precio || !formData.cantidad_disponible || !formData.ubicacion) {
      Swal.fire("Campos requeridos", "Por favor completa todos los campos obligatorios.", "warning");
      return;
    }

    try {
      let res;
      if (modoEdicion) {
        res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/queso/${idEdicion}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        //Simulación de éxito
        console.log("Queso actualizado:", formData);
        res = { ok: true };

      } else {
        res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/queso/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        //Simulación de éxito
        console.log("Queso creado:", formData);
        res = { ok: true };
      }

      if (!res.ok) throw new Error("Error en la solicitud");

      Swal.fire("Éxito", modoEdicion ? "Queso actualizado correctamente" : "Queso registrado correctamente", "success");
      setShowModal(false);
      fetchData(); // Recarga los datos para mostrar los cambios
    } catch (err) {
      console.error("Error en el envío:", err);
      Swal.fire("Error", modoEdicion ? "No se pudo actualizar el queso" : "No se pudo guardar el queso", "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el queso de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/queso/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error();



      Swal.fire("Eliminado", "El queso ha sido eliminado correctamente.", "success");
      fetchData(); // Actualiza la lista
    } catch (err) {
      console.error("Error al eliminar queso:", err);
      Swal.fire("Error", "No se pudo eliminar el queso.", "error");
    }
  };
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Lista de Quesos</h2>

        <div className="d-flex justify-content-end mb-3">
          <ButtonAction onClick={handleCrear} text=" Crear Queso" icon={ClipboardPlus} color="primary" />
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{modoEdicion ? "Editar Queso" : "Registrar Queso"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Control type="text" name="tipo" value={formData.tipo} onChange={handleChange} required />
              </Form.Group>
              {modoEdicion ? <Form.Group className="mb-3">
                <Form.Label>peso (kg)</Form.Label>
                <Form.Control type="number" name="peso" value={formData.peso_unidad_kg} onChange={handleChange} required={modoEdicion ? true : false} />
              </Form.Group> : (
                <></>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control type="number" name="cantidad_disponible" value={formData.cantidad_disponible} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ubicacion</Form.Label>
                <Form.Control as="textarea" rows={3} name="ubicacion" value={formData.Ubicacion} onChange={handleChange} />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="primary">{modoEdicion ? "Actualizar Queso" : "Guardar Queso"}</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Peso (kg)</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Ubicacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="placeholder-glow"><span className="placeholder col-12"></span></div></td>
                    ))}
                  </tr>
                ))
              ) : (
                quesos.map((queso, index) => (
                  <tr key={queso.id_queso}>
                    <td>{index + 1}</td>
                    <td>{queso.nombre || noApli}</td>
                    <td>{queso.tipo || noApli}</td>
                    <td>{queso.peso_unidad_kg || noApli}</td>
                    <td>{queso.cantidad_disponible || noApli}</td>
                    <td>${queso.precio?.toLocaleString("es-CO") || noApli}</td>
                    <td>{queso.ubicacion || noApli}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <ButtonAction onClick={() => handleEditar(queso.id_queso)} icon={Pencil} color="primary" />
                        <ButtonAction onClick={() => handleEliminar(queso.id_queso)} icon={Trash} color="danger" />
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