import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/manager/Page.module.css";
import {
  StatisticsCardGrid,
  MembershipLevelPieChart,
  UserCategoryPieChart,
} from "/src/components/statistic";

const ConfigSystemPage = () => {
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
  ];

  return (
    <div className={styles.bookCatalogPage}>
      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />
      <StatisticsCardGrid />
      <UserCategoryPieChart />
      <MembershipLevelPieChart />
    </div>
  );
};

export default ConfigSystemPage;
