import { Card, Table, Tag, Typography } from "antd";

function ListAchievement() {
  const achievementData = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      type: "ON_TIME_RETURN",
      details: "Trả sách đúng hạn trong 6 tháng liên tiếp",
      pointsAwarded: 15,
    },
    {
      key: "2",
      name: "Trần Thị B",
      type: "BOOK_DONATION",
      details: "Đóng góp 5 cuốn sách mới cho thư viện",
      pointsAwarded: 30,
    },
    {
      key: "3",
      name: "Lê Minh C",
      type: "ACTIVE_PARTICIPANT",
      details: "Tham gia 3 buổi hội thảo về đọc sách",
      pointsAwarded: 20,
    },
    {
      key: "4",
      name: "Phạm Văn D",
      type: "OTHER",
      details: "Hỗ trợ sắp xếp sách trong thư viện",
      pointsAwarded: 10,
    },
  ];

  const getAchievementTag = (type) => {
    const tagColors = {
      ON_TIME_RETURN: "green",
      BOOK_DONATION: "gold",
      ACTIVE_PARTICIPANT: "blue",
      OTHER: "gray",
    };
    return <Tag color={tagColors[type]}>{type}</Tag>;
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Thành tích",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: getAchievementTag,
    },
    {
      title: "Chi tiết",
      dataIndex: "details",
      key: "details",
      align: "center",
      render: (text) => text || "Không có",
    },
    {
      title: "Số điểm cộng",
      dataIndex: "pointsAwarded",
      key: "pointsAwarded",
      align: "center",
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Danh sách thành tích
        </Typography.Title>
      }
      style={{
        textAlign: "center",
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(231, 245, 236, 0.39) 0%,rgba(179, 163, 171, 0.81) 100%)",
      }}
    >
      <Table
        columns={columns}
        dataSource={achievementData}
        pagination={{ pageSize: 3 }}
      />
    </Card>
  );
}

export default ListAchievement;
