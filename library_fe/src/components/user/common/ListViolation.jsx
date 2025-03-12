import { Card, Table, Tag, Typography } from "antd";

function ListViolation() {
  const violationData = [
    {
      key: "1",
      name: "Nguyễn Văn A",
      type: "LATE_RETURN",
      details: "Trả sách trễ 3 ngày",
      officer: "Thư viện viên B",
      fine: "50,000 VND",
      pointsDeducted: 10,
    },
    {
      key: "2",
      name: "Trần Thị B",
      type: "DAMAGED_BOOK",
      details: "Sách bị rách nhiều trang",
      officer: "Thư viện viên C",
      fine: "100,000 VND",
      pointsDeducted: 20,
    },
    {
      key: "3",
      name: "Lê Minh C",
      type: "LOST_BOOK",
      details: "Làm mất sách",
      officer: "Thư viện viên D",
      fine: "200,000 VND",
      pointsDeducted: 50,
    },
    {
      key: "4",
      name: "Phạm Văn D",
      type: "OTHER",
      details: "",
      officer: "Thư viện viên E",
      fine: "30,000 VND",
      pointsDeducted: 5,
    },
  ];

  const getViolationTag = (type) => {
    const tagColors = {
      LATE_RETURN: "blue",
      DAMAGED_BOOK: "orange",
      LOST_BOOK: "red",
      OTHER: "gray",
    };
    return <Tag color={tagColors[type]}>{type}</Tag>;
  };

  const columns = [
    {
      title: "Tên người vi phạm",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Tên lỗi",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: getViolationTag,
    },
    {
      title: "Chi tiết nội dung",
      dataIndex: "details",
      key: "details",
      align: "center",
      render: (text) => text || "Không có",
    },
    {
      title: "Tên người phạt",
      dataIndex: "officer",
      key: "officer",
      align: "center",
    },
    {
      title: "Số tiền phạt",
      dataIndex: "fine",
      key: "fine",
      align: "center",
    },
    {
      title: "Số điểm trừ",
      dataIndex: "pointsDeducted",
      key: "pointsDeducted",
      align: "center",
    },
  ];
  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Danh sách vi phạm
        </Typography.Title>
      }
      style={{
        textAlign: "center",
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        marginTop: "20px",
      }}
    >
      <Table
        columns={columns}
        dataSource={violationData}
        pagination={{ pageSize: 3 }}
      />
    </Card>
  );
}

export default ListViolation;
