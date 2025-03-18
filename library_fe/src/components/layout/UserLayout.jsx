import { Layout } from "antd";
import "antd/dist/reset.css";
import "./UserLayout.css";
import { TopBook, TopUser } from "./RightSidebar";
import UserHeader from "./Header/UserHeader";
import UserSideBar from "./SideBar/UserSideBar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const { Content } = Layout;

const UserLayout = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setShowRightSidebar(false);
      } else {
        setShowRightSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Layout hasSider>
        <UserSideBar />
        <div className="main-content-wrapper">
          <div className="scrollable-content">
            <Content className="content-area">
              <Outlet />
            </Content>

            {showRightSidebar && (
              <div className="right-sidebar">
                <TopUser />
                <TopBook />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
