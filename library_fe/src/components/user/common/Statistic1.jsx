import { Card, Typography } from "antd";
import {
  TrophyOutlined,
  StarOutlined,
  WarningOutlined,
} from "@ant-design/icons";

function Statistic1() {
  const userRank = "Bạc"; // Giả định hạng của user
  const userPoints = 1000; // Giả định số điểm
  const violationCount = 5; // Giả định số lần vi phạm
  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      <Card
        style={{
          flex: 1,
          textAlign: "center",
          background:
            "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(231, 234, 245, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        }}
      >
        <TrophyOutlined
          style={{
            fontSize: 40,
            color:
              userRank === "Vàng"
                ? "gold"
                : userRank === "Bạc"
                ? "gray"
                : "brown",
          }}
        />
        <Typography.Title level={4} style={{ marginTop: 10 }}>
          Bạn là thành viên hạng: {userRank}
        </Typography.Title>
      </Card>

      <Card
        style={{
          flex: 1,
          textAlign: "center",
          background:
            "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(231, 234, 245, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        }}
      >
        <StarOutlined style={{ fontSize: 40, color: "blue" }} />
        <Typography.Title level={4} style={{ marginTop: 10 }}>
          Bạn đang có: {userPoints} điểm
        </Typography.Title>
      </Card>

      <Card
        style={{
          flex: 1,
          textAlign: "center",
          background:
            "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(231, 234, 245, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        }}
      >
        <WarningOutlined style={{ fontSize: 40, color: "red" }} />
        <Typography.Title level={4} style={{ marginTop: 10 }}>
          Bạn đã vi phạm: {violationCount} lần
        </Typography.Title>
      </Card>
    </div>
  );
}

export default Statistic1;
