import { Card, Table, Typography } from "antd";

export default function ListBorrowingBook() {
  const { Text } = Typography;
  const borrowedBooks = [
    {
      key: "1",
      title: "Java Programming",
      borrowedDate: "2025-02-01",
      dueDate: "2025-02-15",
    },
    {
      key: "2",
      title: "React for Beginners",
      borrowedDate: "2025-02-05",
      dueDate: "2025-02-20",
    },
    {
      key: "3",
      title: "Node.js Guide",
      borrowedDate: "2025-02-10",
      dueDate: "2025-02-25",
    },
    {
      key: "4",
      title: "Spring Boot Essentials",
      borrowedDate: "2025-02-12",
      dueDate: "2025-02-28",
    },
    {
      key: "5",
      title: "MongoDB Basics",
      borrowedDate: "2025-02-15",
      dueDate: "2025-03-01",
    },
  ];

  const columns = [
    { title: "Tên sách", dataIndex: "title", key: "title" },
    { title: "Ngày mượn", dataIndex: "borrowedDate", key: "borrowedDate" },
    { title: "Ngày đến hạn", dataIndex: "dueDate", key: "dueDate" },
  ];

  return (
    <Card
      title={
        <Typography.Title
          level={3}
          style={{ textAlign: "center", margin: 0, color: "#333333" }}
        >
          Sách đang mượn
        </Typography.Title>
      }
      style={{
        marginBottom: 20,
        textAlign: "center",
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient( 135deg, #F9F9F9 0%, #E5E5E5 100%)",
      }}
    >
      {borrowedBooks.length > 0 ? (
        <Table
          columns={columns}
          dataSource={borrowedBooks}
          pagination={false}
        />
      ) : (
        <Text
          strong
          style={{ fontSize: "18px", display: "block", margin: "20px 0" }}
        >
          Bạn đang không mượn cuốn sách nào
        </Text>
      )}
    </Card>
  );
}
