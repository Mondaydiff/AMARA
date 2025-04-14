"use client";

import { log } from "@/app/log";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginForm() {
    const [nombre_usuario, setHombre_usuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el refresh de la página

        // Validación de campos vacíos
        if (!nombre_usuario || !password) {
            Swal.fire({
                icon: "error",
                title: "Todos los campos son obligatorios",
                text: "Por favor, completa todos los campos.",
                confirmButtonText: "Aceptar",
            });
            // setError("Todos los campos son obligatorios");
            return;
        }

        // Autenticación con el backend
        try {
            // console.log("Usuario:", nombre_usuario);
            // console.log("Contraseña:", password);
            // console.log("Datos enviados:", JSON.stringify({ nombre_usuario, password }));
            log();

            const response = await fetch(
                "https://amara-backend-production-2ae0.up.railway.app/api/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre_usuario, password }), //Enviando email y password al backend
                }
            );

            const data = await response.json(); // Convertir a JSON
            console.log("Log del response:", data.message); // Ahora sí imprime el contenido correctamente

            // Verificando si la respuesta es correcta si la respuesta no es correcta, lanza un error
            if (!response.ok)
                throw new Error(data.error || "Error en la autenticación");

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Inicio de sesión exitoso",
                color: "white",
                background: "#00b613",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                toast: true, // ¡Esto es clave para que se vea como una notificación pequeña!
                customClass: {
                    popup: 'small-toast'
                }
            });

            // Si la autenticación es exitosa, redirigir al usuario a la página de inicio
            router.push("/tableProduccion");

        } catch (error) {
            setError(error.message);
            // console.error("Error de autenticación:", error.message);
            Swal.fire({
                icon: "error",
                title: "Credenciales incorrectas",
                text: "Por favor, verifica tu usuario y contraseña.",
                confirmButtonText: "Aceptar",
            });
        }

        // Simulando autenticación
        // if (email === "admin@example.com" && password === "123456") {
        //     Swal.fire({
        //         icon: "success",
        //         title:"Inicio de sesión exitoso",
        //         Position: "top-end",
        //         showConfirmButton: false,
        //         timer: 1500,
        //         timerProgressBar: true,
        //     });
        //     router.push("/tablePersonas")
        // } else {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Credenciales incorrectas",
        //         text: "Por favor, verifica tu correo electrónico y contraseña.",
        //         confirmButtonText: "Aceptar",
        //     });
        //     // setError("Credenciales incorrectas");
        // }
    };

    log();

    return (
            <div className="container p-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                    <div className="text-center mb-3">
                        <b>AMARA🧀</b>
                    </div>
                    {/* {error && <p className="text-danger">{error}</p>} */}

                    <h2 className="text-center mb-4">Iniciar Sesión</h2>


                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombre_usuario" className="form-label">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre_usuario"
                                placeholder="Poguito"
                                value={nombre_usuario}
                                onChange={(e) => setHombre_usuario(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
    );
}
