"use client"
import { useEffect, useState } from "react";
import { ClipboardPlus, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { ButtonAction } from "@/components/butons";

export default function TableVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quesos, setQuesos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const noApli = <b>No Aplica</b>;

  const [formData, setFormData] = useState({
    cedula_cliente: ""
  });

  const [detalles, setDetalles] = useState([
    { id_queso: "", presentacion: "", cantidad: "", precio_unitario: "" }
  ]);

  const presentaciones = ["unidad", "canasta"];

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/venta/");
      const data = await res.json();
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = () => {
    setFormData({ cedula_cliente: "" });
    setDetalles([{ id_queso: "", presentacion: "", cantidad: "", precio_unitario: "" }]);
    setShowModal(true);
    fetch("https://amara-backend-production-2ae0.up.railway.app/api/queso")
      .then((res) => res.json())
      .then((data) => setQuesos(data))
      .catch((err) => console.error("Error cargando quesos:", err));

    fetch("https://amara-backend-production-2ae0.up.railway.app/api/cliente")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error cargando clientes:", err));

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][field] = value;
    setDetalles(nuevosDetalles);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { id_queso: "", presentacion: "", cantidad: "", precio_unitario: "" }]);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cedula_cliente: formData.cedula_cliente,
      detalles: detalles.map(d => ({
        id_queso: parseInt(d.id_queso),
        presentacion: d.presentacion,
        cantidad: parseFloat(d.cantidad),
        precio_unitario: parseFloat(d.precio_unitario),
      })),
    };
    console.log(payload);
    try {
      const res = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/venta/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload);
      if (!res.ok) throw new Error();

      Swal.fire("Éxito", "Venta registrada correctamente", "success");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Error al registrar venta:", err);
      Swal.fire("Error", "No se pudo registrar la venta", "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar esta venta?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://amara-backend-production-2ae0.up.railway.app/api/venta/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error();

      Swal.fire("Eliminada", "La venta fue eliminada correctamente.", "success");
      fetchData();
    } catch (err) {
      console.error("Error al eliminar venta:", err);
      Swal.fire("Error", "No se pudo eliminar la venta", "error");
    }
  };


  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Ventas Realizadas</h2>
        <p className="text-muted">Lista de ventas realizadas</p>

        <div className="d-flex justify-content-end mb-3">
          <ButtonAction onClick={handleCrear} icon={ClipboardPlus} color="primary" text="Nueva Venta" />
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Registrar Venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select
                  name="cedula_cliente"
                  value={formData.cedula_nit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.cedula_nit} value={cliente.cedula_nit}>
                      {cliente.nombre_completo} - {cliente.cedula_nit}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>



              <h5>Detalles de la Venta</h5>
              {detalles.map((detalle, index) => (
                <div key={index} className="mb-3 border rounded p-3 position-relative">
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => eliminarDetalle(index)}
                  >
                    X
                  </Button>

                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Label>Queso</Form.Label>
                      <Form.Select
                        required
                        value={detalle.id_queso}
                        onChange={(e) => handleDetalleChange(index, "id_queso", e.target.value)}
                      >
                        <option value="">Seleccione</option>
                        {quesos.map((q) => (
                          <option key={q.id_queso} value={q.id_queso}>{q.nombre}</option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6}>
                      <Form.Label>Presentación</Form.Label>
                      <Form.Select
                        required
                        value={detalle.presentacion}
                        onChange={(e) => handleDetalleChange(index, "presentacion", e.target.value)}
                      >
                        <option value="">Seleccione</option>
                        {presentaciones.map((p, i) => (
                          <option key={i} value={p}>{p}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Label>Cantidad</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(index, "cantidad", e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Precio Unitario</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={detalle.precio_unitario}
                        onChange={(e) => handleDetalleChange(index, "precio_unitario", e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                </div>
              ))}

              <Button variant="secondary" onClick={agregarDetalle} className="mb-3">
                Agregar otro detalle
              </Button>

              <div className="d-grid">
                <Button type="submit" variant="primary">Guardar Venta</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Cédula</th>
                <th>Nombre del Cliente</th>
                <th>Total Venta</th>
                <th>Fecha de Venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <td key={j}><div className="placeholder-glow"><span className="placeholder col-12"></span></div></td>
                  ))}
                </tr>
              ))
                : (
                  ventas.map((venta, index) => (
                    <tr key={venta.id_venta}>
                      <td>{index + 1}</td>
                      <td>{venta.Cedula || noApli}</td>
                      <td>{venta.Nombre_Completo || noApli}</td>
                      <td>${venta.Total_Venta?.toLocaleString("es-CO") || noApli}</td>
                      <td>
                        {venta.Fecha_Venta
                          ? new Date(venta.Fecha_Venta).toLocaleDateString("es-CO", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                          : noApli}
                      </td>
                      <td>
                        <ButtonAction icon={Trash} color="danger" onClick={() => handleEliminar(venta.id_venta)} />
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
