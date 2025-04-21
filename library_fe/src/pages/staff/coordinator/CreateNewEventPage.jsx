import { Card, Col, Breadcrumb } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CreateEventForm } from "/src/components/staff/coordinator/event";
import styles from "/src/styles/members/PatronListPage.module.css";

const CreateNewEventPage = () => {
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
          onClick={() => handleNavigate("/staff/events")}
          className={styles.breadcrumbLink}
        >
          <CalendarOutlined /> Quản lý sự kiện
        </span>
      ),
      key: "events",
    },
    {
      title: (
        <span className={styles.breadcrumbLink}>
          <CalendarOutlined /> Tạo sự kiện mới
        </span>
      ),
      key: "create",
    },
  ];

  return (
    <div className={styles.patronListPage}>
      <Col span={24}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
      </Col>

      <Card variant="borderless" className={styles.mainCard}>
        <CreateEventForm />
      </Card>
    </div>
  );
};

export default CreateNewEventPage;
