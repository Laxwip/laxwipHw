import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/options', src: '/options.png', alt: 'Opciones' },
    { to: '/ventas', src: '/ventas.png', alt: 'Ventas' },
    { to: '/', src: '/home.png', alt: 'Inicio' },
    { to: '/search', src: '/search.png', alt: 'Buscar' },
    { to: '/add', src: '/add.png', alt: 'Añadir' },
  ];

  return (
    <div className='Navbar'>
      {links.map((link) => (
        <Link to={link.to} className='button' key={link.to}>
          <span>
            <img
              className={`icon ${location.pathname === link.to ? 'active' : ''}`}
              src={link.src}
              alt={link.alt}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
