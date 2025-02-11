import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Topbar from "./Topbar";

const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div
      id="wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        id="content-wrapper"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          id="content"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "95vh",
          }}
        >
          <Topbar
            userType={1}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
