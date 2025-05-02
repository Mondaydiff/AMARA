"use client"


export default function Footer() {

    const yearDev = 2025
    const dateCurrent  = new Date().getFullYear();
    const companyName = "Nexus Solutions";
    const websiteUrl = "https://felipe-el-dev.vercel.app/"; // Added website URL

    const yearDisplay = dateCurrent !== yearDev
        ? `${yearDev} - ${dateCurrent}`
        : `${yearDev}`;

    return (
        <>
            <footer className="bg-body-tertiary text-center text-lg-start mt-auto">
                <div className="text-center p-3" style={{ marginTop: '20px' }}>
                    <a className="text-body" href={websiteUrl} target="_blank">{`Derechos reservados ${companyName}`}</a>
                    <p>{`© ${yearDisplay} Copyright`}</p>
                </div>
            </footer>
        </>
    )
}