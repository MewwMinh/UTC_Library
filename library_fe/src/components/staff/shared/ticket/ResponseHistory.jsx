// src/components/supportRequest/ResponseHistory.jsx
import { Card, Timeline, Avatar, Typography, Empty } from "antd";
import {
  CommentOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/ticket/ResponseHistory.module.css";

const { Text } = Typography;

/**
 * Component hiển thị lịch sử phản hồi của yêu cầu hỗ trợ
 */
// eslint-disable-next-line react/prop-types
const ResponseHistory = ({ responses, requestCreatedAt }) => {
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

  // Sắp xếp phản hồi theo thời gian (mới nhất lên đầu)
  const sortedResponses = [...responses].sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );

  return (
    <Card
      className={styles.historyCard}
      title={
        <div className={styles.cardTitle} style={{ marginLeft: 15 }}>
          <CommentOutlined className={styles.titleIcon} />
          <span>Lịch sử phản hồi</span>
        </div>
      }
    >
      {sortedResponses.length > 0 ? (
        <Timeline mode="left" className={styles.timeline}>
          {sortedResponses.map((response, index) => (
            <Timeline.Item
              key={index}
              dot={
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
              }
              color="blue"
            >
              <div className={styles.responseItem}>
                <div className={styles.responseHeader}>
                  <Text strong>{response.staffName}</Text>
                  <Text type="secondary">
                    {formatDateTime(response.createAt)}
                  </Text>
                </div>
                <div className={styles.responseTitle}>
                  <Text strong>{response.title}</Text>
                </div>
                <div className={styles.responseContent}>
                  {response.description}
                </div>
              </div>
            </Timeline.Item>
          ))}

          <Timeline.Item
            dot={<ClockCircleOutlined className={styles.clockIcon} />}
            color="gray"
          >
            <Text type="secondary">
              Tạo yêu cầu {formatDateTime(requestCreatedAt)}
            </Text>
          </Timeline.Item>
        </Timeline>
      ) : (
        <Empty
          description="Chưa có phản hồi nào"
          className={styles.emptyState}
        />
      )}
    </Card>
  );
};

export default ResponseHistory;
