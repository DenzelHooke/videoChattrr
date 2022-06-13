import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-nextjs-toast";

const Layout = ({ children }) => {
  return (
    <>
      <ToastContainer id="toast-container" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
