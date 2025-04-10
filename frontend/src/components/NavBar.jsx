import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "../NavBar.css"

function NavBar(){

    const navigate = useNavigate()

    return(
        <header>
            <div className="navbar-container">
                <Link to="/">
                    <img src="/logo.png" alt="Seattle Smart Spaces" className="navbar-logo"/>
                </Link>
                <Link to="/data">
                    <button className="data-btn">The Data</button>
                </Link>
            </div>
        </header>
    )
}

export default NavBar