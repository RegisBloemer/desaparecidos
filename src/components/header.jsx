import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";

export default function Header() {
    return (
        <header className="sticky-top">
            <Navbar expand="sm" >
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">
                        Desaparecidos
                    </Link>
                </div>
            </Navbar>
        </header>
    );
}