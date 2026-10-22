import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;