import { Breadcrumb } from "antd";
import { EditOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EmployeeDetail from "/src/components/admin/manage-employee/EmployeeDetail";
import styles from "/src/styles/manager/Page.module.css";

const EmployeeDetailPage = () => {
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
          <EditOutlined /> Thông tin chi tiết
        </span>
      ),
      key: "books",
    },
  ];

  return (
    <div className={styles.bookCatalogPage}>
      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />
      <EmployeeDetail />
    </div>
  );
};

export default EmployeeDetailPage;
