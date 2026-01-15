import { Routes, Route } from 'react-router-dom';
import Login from '../views/admin/Login';
import DashboardCliente from '../views/cliente/DashboardCliente';
import MetodosPagoCliente from '../views/cliente/MetodosPagoCliente';
import TiendaCliente from '../views/cliente/TiendaCliente';
import Factura from '../views/cliente/Factura';
import NuevaFactura from '../views/cliente/NuevaFactura';
import FacturaDetalle  from '../views/cliente/FacturaDetalle';
import Cliente from '../views/cliente/Cliente';

import AppLayout from '../layouts/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}> 
        <Route index element={<DashboardCliente />} />
        <Route path="dashboard" element={<DashboardCliente />} />
        <Route path="metodos-pago" element={<MetodosPagoCliente />} />
        <Route path="tienda" element={<TiendaCliente />} />
        <Route path="facturas" element={<Factura />} />
        <Route path="nueva-factura" element={<NuevaFactura />} />
        <Route path="cliente" element={<Cliente />} />
      </Route>
      <Route path="/facturas/:id" element={<FacturaDetalle />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;