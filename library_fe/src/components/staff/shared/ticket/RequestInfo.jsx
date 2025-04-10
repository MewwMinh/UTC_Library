/* eslint-disable react/prop-types */
// src/components/supportRequest/RequestInfo.jsx

import { Card, Descriptions, Tag } from "antd";
import styles from "/src/styles/ticket/RequestInfo.module.css";

/**
 * Component hiển thị thông tin chi tiết của yêu cầu
 */
const RequestInfo = ({ ticketDetails }) => {
  // Format ngày giờ
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  // Hiển thị trạng thái
  const renderStatusTag = (status) => {
    let color;
    switch (status) {
      case "Đang chờ xử lý":
        color = "gold";
        break;
      case "Đang xử lý":
        color = "blue";
        break;
      case "Đã hoàn thành":
        color = "green";
        break;
      case "Bị từ chối":
        color = "red";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <Card
      className={styles.infoCard}
      title={<div style={{ marginLeft: 15 }}>Thông tin yêu cầu</div>}
    >
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Mã yêu cầu">
          {ticketDetails.ticketID}
        </Descriptions.Item>
        <Descriptions.Item label="Loại yêu cầu">
          {ticketDetails.problem}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDateTime(ticketDetails.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {renderStatusTag(ticketDetails.status)}
        </Descriptions.Item>

        <Descriptions.Item label="Nội dung" span={2}>
          <div className={styles.description}>{ticketDetails.description}</div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default RequestInfo;
