// "use client"

export function ButtonAction({ text, icon: Icon, color, style, onClick }) {

    // const Icon = icon

    return (
        <button className={`btn btn-outline-${color}`} style={style} onClick={onClick}>
            <Icon size={16}/>
            {text}
        </button>
    )
}