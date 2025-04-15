// src/components/reading-room/ReadingRoomControl.jsx
import { useState } from "react";
import { Row, Col, Typography } from "antd";
import {
  CheckInPatron,
  PatronsInReadingRoom,
} from "/src/components/staff/coordinator/reading-room";
import styles from "/src/styles/ReadingRoom.module.css";

const { Title } = Typography;

const ReadingRoomControl = () => {
  // Sử dụng counter làm trigger để làm mới danh sách bạn đọc
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCheckInSuccess = () => {
    // Tăng counter để làm mới danh sách bạn đọc
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles.readingRoomContainer}>
      <Title level={2} className={styles.pageTitle}>
        Quản lý phòng đọc
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <CheckInPatron onCheckInSuccess={handleCheckInSuccess} />
        </Col>
        <Col xs={24} lg={16}>
          <PatronsInReadingRoom refreshTrigger={refreshTrigger} />
        </Col>
      </Row>
    </div>
  );
};

export default ReadingRoomControl;
