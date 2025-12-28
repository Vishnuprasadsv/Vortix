import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
