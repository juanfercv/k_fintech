import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente de navegación (Menu siempre visible)
const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Mostrar navbar en todas las rutas excepto en las de autenticación
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  if (!showNavbar) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Sistema de Facturación</h1>
        <ul className="nav-links">
          <li>
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/metodos-pago" 
              className={`nav-link ${isActive('/metodos-pago') ? 'active' : ''}`}
            >
              Métodos de Pago
            </Link>
          </li>
          <li>
            <Link 
              to="/tienda" 
              className={`nav-link ${isActive('/tienda') ? 'active' : ''}`}
            >
              Información de Tienda
            </Link>
          </li>
          <li>
            <Link 
              to="/facturas" 
              className={`nav-link ${isActive('/facturas') ? 'active' : ''}`}
            >
              Facturas
            </Link>
          </li>
          <li>
            <Link 
              to="/cliente" 
              className={`nav-link ${isActive('/cliente') ? 'active' : ''}`}
            >
              Clientes
            </Link>
          </li> 
        </ul>
        {user && (
          <div className="user-info">
            Bienvenido, {user.nombres_Dueño} {user.apellidos_Dueño}
          </div>
        )}
      </div>
    </nav>  
  );
};

export default Navigation;