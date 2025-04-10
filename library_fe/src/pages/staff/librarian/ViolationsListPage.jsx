import {
  ViolationStatistics,
  ViolationList,
} from "/src/components/staff/librarian/violation";
import { Breadcrumb, Card } from "antd";
import { BookOutlined, HomeOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "/src/styles/books/BookCatalogPage.module.css";
const ViolationsListPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const breadcrumbItems = [
    {
      title: (
        <span
          onClick={() => handleNavigate("/staff/dashboard")}
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
          onClick={() => handleNavigate("/staff/violations")}
          className={styles.breadcrumbLink}
        >
          <WarningOutlined /> Quản lý vi phạm
        </span>
      ),
      key: "books",
    },
  ];
  return (
    <div className={styles.bookCatalogPage}>
      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />

      <Card className={styles.mainCard}>
        <ViolationStatistics />
        <ViolationList />
      </Card>
    </div>
  );
};

export default ViolationsListPage;
