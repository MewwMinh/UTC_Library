import { BookOrder, SeatOrder } from "/src/components/user/order";
import { Typography } from "antd";
import { BookOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Order() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        background:
          "url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')",
        minHeight: "100vh",
      }}
    >
      <div
        className="page-header"
        style={{
          textAlign: "center",
          marginBottom: "25px",
          padding: "16px",
          background: "#2d6a4f",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="header-animation"></div>

        <div className="page-header-content">
          <Title
            level={2}
            style={{ margin: "10px 0", color: "white", fontWeight: 600 }}
          >
            <BookOutlined style={{ marginRight: 12 }} />
            Quản lý đặt sách & đặt chỗ
          </Title>
          <Paragraph
            style={{
              width: "80%",
              margin: "0 auto",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            Đặt sách và đặt chỗ để có trải nghiệm học tập tốt nhất tại thư viện
          </Paragraph>
        </div>
      </div>

      <BookOrder />
      <SeatOrder />

      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
          padding: "15px",
          fontSize: "14px",
          color: "#888",
        }}
      >
        © Thư viện Trường Đại học Giao thông vận tải - 2025
      </div>
    </div>
  );
}
