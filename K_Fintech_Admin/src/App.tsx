// import MetodosPago from './components/admin/MetodosPago'; // Eliminado - usar Gestión de Métodos de Pago
import FacturasAdmin from './components/admin/FacturasAdmin';
import TiendasAdmin from './components/admin/TiendasAdmin';
import ConfiguracionGeneral from './components/admin/ConfiguracionGeneral';
import ClienteAdmin from './components/cliente/ClienteAdmin';
import MetodosPagoAdmin from './components/admin/MetodosPagoAdmin';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';



// Componente Layout para el panel de administración
function Layout() {
  // Usuario simulado para el sistema sin autenticación
  const user = {
    id: 1,
    nombres_Dueño: 'Admin',
    apellidos_Dueño: 'System',
    correo_electronico_Dueño: 'admin@fintech.com',
    rol: 'admin'
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',gap:12}}>
          <div className="admin-brand"><h1>K_Fintech</h1></div>
        </div>

        <div className="admin-user">
          <span>Bienvenido, {user.nombres_Dueño} {user.apellidos_Dueño}</span>
        </div>

        <nav className="admin-nav">
          <NavLink className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} to="/cliente">Gestión de Clientes</NavLink>
          <NavLink className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} to="/tiendas-admin">Gestión de Tiendas</NavLink>
          <NavLink className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} to="/facturas-admin">Gestión de Facturas</NavLink>
          <NavLink className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} to="/metodos-pago-admin">Gestión de Métodos de Pago</NavLink>
          <NavLink className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'} to="/configuracion-general">⚙️ Configuración General</NavLink>
        </nav>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<ClienteAdmin />} />
          <Route path="/cliente" element={<ClienteAdmin />} />
          <Route path="/tiendas-admin" element={<TiendasAdmin />} />
          <Route path="/facturas-admin" element={<FacturasAdmin />} />
          <Route path="/metodos-pago-admin" element={<MetodosPagoAdmin />} />
          <Route path="/configuracion-general" element={<ConfiguracionGeneral />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta directa al layout del panel de administración */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;