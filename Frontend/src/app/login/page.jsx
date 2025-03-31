"use client"

import { log } from "@/app/log"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import Swal from 'sweetalert2'

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
            return
        }

        // Autenticación con el backend
        try {
            // console.log("Usuario:", nombre_usuario);
            // console.log("Contraseña:", password);
            // console.log("Datos enviados:", JSON.stringify({ nombre_usuario, password }));
            log();


            const response = await fetch("https://amara-backend-production-2ae0.up.railway.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ nombre_usuario, password }) //Enviando email y password al backend
            });

            const data = await response.json(); // Convertir a JSON
            console.log("Log del response:", data.message); // Ahora sí imprime el contenido correctamente

            // Verificando si la respuesta es correcta si la respuesta no es correcta, lanza un error
            if (!response.ok) throw new Error(data.error || "Error en la autenticación");

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                Position: "top-end",
                showConfirmButton: false,
                timer: 1100,
                timerProgressBar: true,
            });

            // Si la autenticación es exitosa, redirigir al usuario a la página de inicio
            router.push("/tablePersonas");

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
    }

    log();

    return (
        <div className="max-w-md mx-auto mt-10 p-10 w-full border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
            {/* {error && <p className="text-red-500">{error}</p>} */}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="text">Usuario</Label>
                    <Input
                        id="nombre_usuario"
                        type="text"
                        placeholder="Poguito"
                        value={nombre_usuario}
                        onChange={(e) => setHombre_usuario(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full">Iniciar Sesión</Button>
            </form>
        </div>
    )
}
