import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StateWatcher from "./StateWatcher";
import Script from "next/script";
import Head from "next/head";
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <Script src="/js/AgoraRTCSDK-3.6.10.js"></Script>
      <StateWatcher />
      <ToastContainer id="toast-container" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
