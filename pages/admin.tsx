import React from 'react';
import { AdminProvider } from '../components/AdminContext';
import AdminDashboard from '../components/AdminDashboard';

export default function Admin() {
  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}
