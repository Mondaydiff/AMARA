'use client'

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Swal from "sweetalert2";

export default function Logout() {
    const router = useRouter();
    const pathname = usePathname(); // Obtiene la ruta actual


    // Esconde el botón de logout si la ruta es "/login"
    // if (pathname === "/login" || pathname === "/register"){
    if (pathname === "/login"){
        return null; // No renderiza el botón si la ruta es "/login"
    }

    const handleGoHome = async () => {

        const result = await Swal.fire({
            icon: "warning",
            title: "¿Seguro quieres salir?",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                showConfirmButton: false,
                timer: 1100,
                timerProgressBar: true,
            })
            router.push("/"); // Redirige a la página de inicio
        }
    };

    return (
        <>
            <Button className="fixed top-4 right-4 z-50 bg-blue-500 text-white" onClick={handleGoHome}>
                Logout
            </Button>
        </>
    )
}