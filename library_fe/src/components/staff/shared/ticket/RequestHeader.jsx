/* eslint-disable react/prop-types */
// src/components/supportRequest/RequestHeader.jsx
import { Breadcrumb, Button, Space, Typography, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "/src/styles/ticket/RequestHeader.module.css";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

/**
 * Component hiển thị phần header của chi tiết yêu cầu hỗ trợ
 */
const RequestHeader = ({ ticketId, title, status }) => {
  const navigate = useNavigate();
  // Hiển thị trạng thái
  const renderStatusTag = (status) => {
    let color, text;
    switch (status) {
      case "Đang chờ xử lý":
        color = "gold";
        text = "Đang chờ xử lý";
        break;
      case "Đang xử lý":
        color = "blue";
        text = "Đang xử lý";
        break;
      case "Đã hoàn thành":
        color = "green";
        text = "Đã hoàn thành";
        break;
      case "Bị từ chối":
        color = "red";
        text = "Bị từ chối";
        break;
      default:
        color = "default";
        text = status;
    }
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <div className={styles.headerContainer}>
      {/* Breadcrumb */}
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <a href="#">
            <span>Dashboard</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#">
            <span>Quản lý yêu cầu hỗ trợ</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>{ticketId}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div className={styles.titleContainer}>
        <Space size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Title level={3} className={styles.title}>
            {title}
          </Title>
          {renderStatusTag(status)}
        </Space>
      </div>
    </div>
  );
};

export default RequestHeader;
