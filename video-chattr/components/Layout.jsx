import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-nextjs-toast";
import Head from "next/head";
import ErrorWatcher from "./ErrorWatcher";
import Script from "next/script";

const Layout = ({ children }) => {
  return (
    <>
      <Script src="/js/AgoraRTCSDK-3.6.10.js"></Script>
      <ErrorWatcher />
      <ToastContainer id="toast-container" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
