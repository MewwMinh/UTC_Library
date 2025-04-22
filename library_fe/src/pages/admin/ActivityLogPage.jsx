import { Breadcrumb } from "antd";
import { HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ActivityLog from "/src/components/admin/activity-log/ActivityLog";
import styles from "/src/styles/manager/Page.module.css";

const ActivityLogPage = () => {
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
          onClick={() => handleNavigate("/manager/activity-logs")}
          className={styles.breadcrumbLink}
        >
          <FileTextOutlined /> Nhật ký hoạt động
        </span>
      ),
      key: "logs",
    },
  ];

  return (
    <div className={styles.bookCatalogPage}>
      <Breadcrumb items={breadcrumbItems} className={styles.breadcrumbBelow} />
      <ActivityLog />
    </div>
  );
};

export default ActivityLogPage;
