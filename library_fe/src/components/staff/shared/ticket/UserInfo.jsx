/* eslint-disable react/prop-types */
// src/components/supportRequest/UserInfo.jsx
import {
  Card,
  Avatar,
  Typography,
  Tag,
  Divider,
  Descriptions,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "/src/styles/ticket/UserInfo.module.css";

const { Text, Title } = Typography;

/**
 * Component hiển thị thông tin người dùng gửi yêu cầu
 */
const UserInfo = ({ userDetails }) => {
  // Hiển thị màu cho loại thành viên
  const getMembershipColor = (type) => {
    switch (type) {
      case "Vàng":
        return "#FFD700";
      case "Bạc":
        return "#C0C0C0";
      case "Đồng":
        return "#CD7F32";
      default:
        return "#000000";
    }
  };

  return (
    <Card
      className={styles.userCard}
      title={
        <div className={styles.cardTitle} style={{ marginLeft: 15 }}>
          <UserOutlined className={styles.titleIcon} />
          <span>Thông tin người gửi yêu cầu</span>
        </div>
      }
    >
      <div className={styles.userHeader}>
        <Avatar
          size={64}
          src={userDetails.userImage}
          icon={!userDetails.userImage && <UserOutlined />}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <Title level={5} className={styles.userName}>
            {userDetails.patronName}
          </Title>
          <div className={styles.userId}>
            <Text type="secondary">MSSV/Mã bạn đọc:</Text> {userDetails.userID}
          </div>
          <Tag
            color={getMembershipColor(userDetails.membershipType)}
            className={styles.membershipTag}
          >
            Thành viên {userDetails.membershipType}
          </Tag>
        </div>
      </div>

      <Divider className={styles.divider} />

      <Descriptions column={1} size="small">
        <Descriptions.Item label="Email" className={styles.descriptionItem}>
          {userDetails.email}
        </Descriptions.Item>
        <Descriptions.Item
          label="Điểm thành viên"
          className={styles.descriptionItem}
        >
          {userDetails.memberPoints}
        </Descriptions.Item>
      </Descriptions>

      <Divider className={styles.divider} />

      <div className={styles.actionButtons}>
        <Button type="link" className={styles.actionButton}>
          Xem lịch sử mượn sách
        </Button>
        <Button type="link" className={styles.actionButton}>
          Xem các yêu cầu khác
        </Button>
      </div>
    </Card>
  );
};

export default UserInfo;
