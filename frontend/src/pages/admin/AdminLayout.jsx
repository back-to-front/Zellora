import { useState } from "react";
import { FaUsersCog, FaChartBar } from "react-icons/fa";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className='admin-layout'>
      <div className='admin-sidebar'>
        <h2 className='admin-title'>Admin</h2>

        <nav className='admin-nav'>
          <button
            className={`admin-nav-item ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartBar className='admin-nav-icon' />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsersCog className='admin-nav-icon' />
            <span>User Management</span>
          </button>
        </nav>
      </div>

      <div className='admin-content'>
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminLayout;
