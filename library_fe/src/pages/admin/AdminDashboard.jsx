import { Col, Row } from "antd";
import styles from "/src/styles/manager/Page.module.css";
import {
  StatisticsCardGrid,
  MembershipLevelPieChart,
  UserCategoryPieChart,
  BorrowReturnStatistics,
  BorrowReturnChart,
  LibraryUsageByMonthChart,
  LibraryUsageByYearChart,
  TopBorrowedBooksChart,
} from "/src/components/statistic";

const AdminDashboard = () => {
  return (
    <div className={styles.bookCatalogPage}>
      {/* Thống kê tổng quan */}
      <div style={{ marginBottom: 24 }}>
        <StatisticsCardGrid />
      </div>

      {/* Biểu đồ phân tích người dùng */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <UserCategoryPieChart />
        </Col>
        <Col xs={24} md={12}>
          <MembershipLevelPieChart />
        </Col>
      </Row>

      {/* Thống kê mượn/trả sách */}
      <div style={{ marginBottom: 24 }}>
        <BorrowReturnStatistics />
      </div>

      <div style={{ marginBottom: 24 }}>
        <BorrowReturnChart />
      </div>

      {/* Thống kê sử dụng thư viện */}
      <div style={{ marginBottom: 24 }}>
        <LibraryUsageByYearChart />
      </div>

      <div style={{ marginBottom: 24 }}>
        <LibraryUsageByMonthChart />
      </div>

      {/* Top sách được mượn nhiều nhất */}
      <div style={{ marginBottom: 24 }}>
        <TopBorrowedBooksChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
