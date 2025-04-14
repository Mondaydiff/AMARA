"use client"

import Link from "next/link"
import { Home, Users, LogOut, Factory } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Swal from "sweetalert2"

const links = [
    { href: "/tableProduccion", label: "Produccion", icon: <Factory className="me-1" size={16} />},
    { href: "/tablePersonas", label: "Personas", icon: <Users className="me-1" size={16} /> },
]

export default function Navbar(props) {
    const pathname = usePathname()
    const router = useRouter()

    if (pathname === "/login") return null

    const handleGoHome = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "¿Seguro quieres salir?",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        })

        if (result.isConfirmed) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Sesión cerrada",
                background: "#00b613",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                customClass: {
                    popup: 'small-toast'
                }
            })
            router.push("/")
        }
    }

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom shadow-sm px-4 py-2">
            <div className="container-fluid">
                <span className="navbar-brand fw-bold">AMARA🧀</span>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        {links.map(({ href, label, icon }) => (
                            <li key={href} className="nav-item">
                                <Link
                                    href={href}
                                    className={`nav-link d-flex align-items-center ${pathname === href ? 'fw-semibold text-primary' : ''}`}
                                >
                                    {icon}
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button className="btn btn-danger d-flex align-items-center" onClick={handleGoHome}>
                        <LogOut className="me-2" size={16} />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    )
}
