import { useParams } from "react-router-dom";
import { Typography, Divider } from "antd";

import {
  PatronInformation,
  BorrowHistory,
  ViolationHistory,
  ReadingRoomHistory,
} from "/src/components/staff/coordinator/patron";

import styles from "/src/styles/members/PatronDetail.module.css";

const { Title } = Typography;

const PatronDetails = () => {
  // Lấy patronID từ URL params
  const { patronID } = useParams();

  return (
    <div className={styles.patronDetailContainer}>
      <Title level={2} className={styles.pageTitle}>
        Thông tin chi tiết bạn đọc
      </Title>

      <div className={styles.sectionContainer}>
        <PatronInformation patronID={patronID} />
      </div>

      <Divider />

      <div className={styles.sectionContainer}>
        <Title level={3} className={styles.sectionTitle}>
          Lịch sử mượn sách
        </Title>
        <BorrowHistory patronID={patronID} />
      </div>

      <Divider />

      <div className={styles.sectionContainer}>
        <Title level={3} className={styles.sectionTitle}>
          Lịch sử sử dụng phòng đọc
        </Title>
        <ReadingRoomHistory patronID={patronID} />
      </div>

      <Divider />

      <div className={styles.sectionContainer}>
        <Title level={3} className={styles.sectionTitle}>
          Vi phạm của bạn đọc
        </Title>
        <ViolationHistory patronID={patronID} />
      </div>
    </div>
  );
};

export default PatronDetails;
