import { Card, Typography, Row, Col, Button, Breadcrumb } from "antd";
import { UserOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PatronList from "/src/components/staff/coordinator/patron/PatronList";
import styles from "/src/styles/members/PatronListPage.module.css";

const { Title } = Typography;

const PatronListPage = () => {
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
          onClick={() => handleNavigate("/staff/members")}
          className={styles.breadcrumbLink}
        >
          <UserOutlined /> Quản lý thành viên
        </span>
      ),
      key: "books",
    },
  ];

  return (
    <div className={styles.patronListPage}>
      <Col span={24}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
      </Col>

      <Card variant="borderless" className={styles.mainCard}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Title level={2} className={styles.pageTitle}>
              <UserOutlined /> Quản lý bạn đọc
            </Title>
          </Col>
          {/* <Col xs={24} md={12} className={styles.actionGroup}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/staff/add-patron")}
              className={styles.addButton}
            >
              Thêm bạn đọc
            </Button>
          </Col> */}
        </Row>

        <PatronList />
      </Card>
    </div>
  );
};

export default PatronListPage;
