import { Breadcrumb } from "antd";
import { HomeOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateEmployee from "/src/components/admin/manage-employee/CreateEmployee";
import styles from "/src/styles/manager/Page.module.css";

const EmployeeCreatePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const breadcrumbItems = [
    {
      title: (
        <span
          onClick={() => handleNavigate("/manager/dashboard")}
          className={styles.breadcrumbLink}
        >
          <HomeOutlined /> Trang chủ
        </span>
      ),
      key: "home",
    },
    {
      title: (
        <span
          onClick={() => handleNavigate("/manager/employees")}
          className={styles.breadcrumbLink}
        >
          <UserOutlined /> Quản lý nhân viên thư viện
        </span>
      ),
      key: "books",
    },
    {
      title: (
        <span className={styles.breadcrumbLink}>
          <UserAddOutlined /> Tạo mới nhân viên
        </span>
      ),
      key: "books",
    },
  ];

  return (
    <div className={styles.bookCatalogPage}>
      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />
      <CreateEmployee />
    </div>
  );
};

export default EmployeeCreatePage;
