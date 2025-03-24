import {
  AlertOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

export default function OverviewStats() {
  const statisticsData = {
    booksBorrowed: 57,
    booksReturned: 42,
    pendingRequests: 8,
    overdueBorrowers: 15,
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Sách đã mượn (hôm nay)"
            value={statisticsData.booksBorrowed}
            prefix={<BookOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Sách đã trả (hôm nay)"
            value={statisticsData.booksReturned}
            prefix={<ReloadOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Yêu cầu đang chờ"
            value={statisticsData.pendingRequests}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Mượn quá hạn"
            value={statisticsData.overdueBorrowers}
            prefix={<AlertOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
