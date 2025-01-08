import React from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div className='navbar'>
                <div className="navbar-logo">
                    <img className="logo-img" src="https://cdn-icons-png.flaticon.com/512/172/172851.png" alt="" />
                    <h1>DR Analyzer</h1>
                </div>
                <div className='navbar-link'>
                    <Link to='/'>Dashboard</Link>
                    <Link to='/profileupdate'>Add</Link>
                    <Link to='/learnmore'>Learn</Link>
                    <Link to='/search'>Analyze</Link>
                    <Link to='/search'>View</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar