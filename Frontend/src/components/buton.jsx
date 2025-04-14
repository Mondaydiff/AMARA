"use client"

export default function Boton({text, color, estado}) {
    return(
        <button className={`btn btn-${color} ${estado}`}>
            {text}
        </button>
    )
}