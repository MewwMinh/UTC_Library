import {
  BookOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row } from "antd";

function Statistic() {
  const stats = {
    totalBorrowed: 11374,
    dueSoon: 53756,
    recentViolations: 98992,
    totalComments: 41318,
  };

  const cardStyle = {
    marginBottom: "20px",
    background:
      "url('https://www.transparenttextures.com/patterns/shattered.png'), linear-gradient( #D3D3D3 0%, #A9B1B8 100%)",
    borderRadius: "10px",
    textAlign: "center",
    color: "#333",
  };

  const iconStyle = { fontSize: "28px", marginBottom: "10px" };
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card style={cardStyle} variant={false}>
          <BookOutlined style={iconStyle} />
          <h2>Tổng số người dùng</h2>
          <p style={{ fontSize: 28, fontWeight: "bold" }}>
            {stats.totalBorrowed}
          </p>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} variant={false}>
          <ClockCircleOutlined style={iconStyle} />
          <h2>Số lượng sách trong thư viện</h2>
          <p style={{ fontSize: 28, fontWeight: "bold" }}>{stats.dueSoon}</p>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} variant={false}>
          <ExclamationCircleOutlined style={iconStyle} />
          <h2>Số lượt mượn sách trong tuần qua</h2>
          <p style={{ fontSize: 28, fontWeight: "bold" }}>
            {stats.recentViolations}
          </p>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={cardStyle} variant={false}>
          <CommentOutlined style={iconStyle} />
          <h2>Số lượt vi phạm trong tuần qua</h2>
          <p style={{ fontSize: 28, fontWeight: "bold" }}>
            {stats.totalComments}
          </p>
        </Card>
      </Col>
    </Row>
  );
}

export default Statistic;
