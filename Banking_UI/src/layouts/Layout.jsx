/* ═══════════════════════════════════════════════════════════════════════
   Layout Component
   The shared page layout wrapper used by all authenticated routes.
   Renders the sidebar navigation on the left and the page content
   (via React Router's Outlet) in the main content area on the right.
   ═══════════════════════════════════════════════════════════════════════ */

import { Outlet } from 'react-router-dom'; /* Outlet renders the matched child route component */
import Sidebar from '../components/Sidebar/Sidebar'; /* Import the sidebar navigation */
import './Layout.css'; /* Import layout-specific styles */

/* ─── Layout Component ───────────────────────────────────────────────
   Wraps each page in a flex container with the sidebar on the left
   and a main content area on the right. The Outlet component is
   replaced by the matched child route's component at runtime.
   ───────────────────────────────────────────────────────────────────── */
export default function Layout() {
  return (
    <div className="app-layout">        {/* Flex container for sidebar + content */}
      <Sidebar />                        {/* Fixed sidebar navigation on the left */}
      <main className="main-content">    {/* Main content area pushed right of sidebar */}
        <Outlet />                       {/* Renders the active child route component */}
      </main>
    </div>
  );
}
