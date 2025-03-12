import { Layout } from "antd";
import "antd/dist/reset.css";
import "./UserLayout.css";
import { TopBook, TopUser } from "./RightSidebar";
import UserHeader from "./Header/UserHeader";
import UserSideBar from "./SideBar/UserSideBar";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const UserLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Layout hasSider>
        <UserSideBar />
        <Layout className="layout-container" style={{ top: "64px" }}>
          <Content
            className="content-area"
            // style={{ background: "linear-gradient(180deg, #E3F2FD, #F3E5F5)" }}
          >
            <Outlet></Outlet>
          </Content>
          <Sider width={300} className="scrollable-sider">
            <TopUser />
            <TopBook />
          </Sider>
        </Layout>
      </Layout>
      {/* <Footer
        style={{
          textAlign: "center",
          background: "#ffffff",
          padding: "10px",
          // marginTop: "250px",
        }}
      >
        Library Management ©2025
      </Footer> */}
    </Layout>
  );
};

export default UserLayout;
