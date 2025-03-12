import { Card, Table, Tag, Typography } from "antd";
import { useState } from "react";

function BorrowHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const historyData = [
    {
      key: "1",
      title: "Spring Boot",
      borrowedDate: "2025-01-10",
      returnDate: "2025-01-20",
      status: "Đúng hạn",
    },
    {
      key: "2",
      title: "MongoDB Basics",
      borrowedDate: "2025-01-05",
      returnDate: "2025-01-25",
      status: "Trả muộn",
    },
    {
      key: "3",
      title: "React Guide",
      borrowedDate: "2025-01-15",
      returnDate: "2025-01-28",
      status: "Đúng hạn",
    },
    {
      key: "4",
      title: "Node.js in Action",
      borrowedDate: "2025-01-12",
      returnDate: "2025-01-22",
      status: "Đúng hạn",
    },
    {
      key: "5",
      title: "JavaScript Essentials",
      borrowedDate: "2025-01-08",
      returnDate: "2025-01-18",
      status: "Trả muộn",
    },
    {
      key: "6",
      title: "CSS Mastery",
      borrowedDate: "2025-01-20",
      returnDate: "2025-01-30",
      status: "Đúng hạn",
    },
    {
      key: "7",
      title: "HTML & CSS",
      borrowedDate: "2025-01-25",
      returnDate: "2025-02-04",
      status: "Đúng hạn",
    },
    {
      key: "8",
      title: "Python Basics",
      borrowedDate: "2025-01-18",
      returnDate: "2025-01-28",
      status: "Trả muộn",
    },
    {
      key: "9",
      title: "Django for Professionals",
      borrowedDate: "2025-01-22",
      returnDate: "2025-02-01",
      status: "Đúng hạn",
    },
    {
      key: "10",
      title: "Data Structures",
      borrowedDate: "2025-01-30",
      returnDate: "2025-02-10",
      status: "Đúng hạn",
    },
  ];

  const historyColumns = [
    { title: "Tên sách", dataIndex: "title", key: "title" },
    { title: "Ngày mượn", dataIndex: "borrowedDate", key: "borrowedDate" },
    { title: "Ngày trả", dataIndex: "returnDate", key: "returnDate" },
    {
      title: "Tình trạng trả",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Trả muộn" ? "red" : "green"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Card
      title={
        <Typography.Title
          level={3}
          style={{ textAlign: "center", margin: 0, color: "#333333" }}
        >
          Lịch sử mượn sách
        </Typography.Title>
      }
      style={{
        marginBottom: 20,
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(135deg, #F9F9F9 0%, #E5E5E5 100%)",
      }}
    >
      {historyData.length > 0 ? (
        <Table
          columns={historyColumns}
          dataSource={historyData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      ) : (
        <Typography.Text
          strong
          style={{ display: "block", textAlign: "center", fontSize: 16 }}
        >
          Bạn chưa mượn quyển sách nào từ thư viện !!!
        </Typography.Text>
      )}
    </Card>
  );
}

export default BorrowHistory;
