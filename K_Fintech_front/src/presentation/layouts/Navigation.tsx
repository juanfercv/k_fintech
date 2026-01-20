import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Asegúrate de que tu archivo CSS esté importado, por ejemplo:
// import './App.css'; 

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // 1. ESTADO: Controla si el menú está abierto o cerrado en móvil
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  // Ocultar en login/register
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  // 2. FUNCIÓN: Cierra el menú (usada al hacer clic en enlaces o en la X)
  const closeMenu = () => setIsOpen(false);

  if (!showNavbar) {
    return null;
  }

  return (
    <>
      {/* 3. BOTÓN HAMBURGUESA (Solo visible en móvil gracias al CSS) */}
      <button 
        className="mobile-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* 4. OVERLAY (Fondo oscuro al abrir en móvil) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}

      {/* 5. SIDEBAR: Agregamos la clase 'open' si el estado es true */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <h1 className="sidebar-title">K_Fintech</h1>
          
          {/* 6. BOTÓN CERRAR (X) */}
          <button 
            className="close-btn" 
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <ul className="sidebar-links">
          <li>
            <Link 
              to="/dashboard" 
              className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu} // Cerramos al navegar
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/metodos-pago" 
              className={`sidebar-link ${isActive('/metodos-pago') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Métodos de Pago
            </Link>
          </li>
          <li>
            <Link 
              to="/tienda" 
              className={`sidebar-link ${isActive('/tienda') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Información de Tienda
            </Link>
          </li>
          <li>
            <Link 
              to="/facturas" 
              className={`sidebar-link ${isActive('/facturas') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Facturas
            </Link>
          </li>
          <li>
            <Link 
              to="/cliente" 
              className={`sidebar-link ${isActive('/cliente') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Clientes
            </Link>
          </li> 
        </ul>

        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.nombres_Dueño.charAt(0)}{user.apellidos_Dueño.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.nombres_Dueño}</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        )}
      </nav>  
    </>
  );
};

export default Navigation;