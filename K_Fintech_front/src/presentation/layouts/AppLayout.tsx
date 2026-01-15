import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const AppLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="view-container">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;