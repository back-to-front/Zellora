import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className='app-container'>
      <Header />
      <main className='main-content'>
        <div className='container'>
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster
        position='bottom-right'
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: "var(--border-radius)",
            boxShadow: "var(--box-shadow)",
          },
          success: {
            style: {
              background: "var(--success-color)",
              color: "var(--text-white)",
            },
          },
          error: {
            style: {
              background: "var(--danger-color)",
              color: "var(--text-white)",
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
