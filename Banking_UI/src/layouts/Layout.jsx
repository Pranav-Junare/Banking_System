import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
