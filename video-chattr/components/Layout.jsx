import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-nextjs-toast";
import Head from "next/head";
import ErrorWatcher from "./ErrorWatcher";
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <script src="/js/AgoraRTCSDK-3.6.10.js"></script>
      </Head>
      <ErrorWatcher />
      <ToastContainer id="toast-container" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
