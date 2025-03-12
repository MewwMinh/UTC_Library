import { Card, Table, Typography } from "antd";

function ListCloseToDueBook() {
  const upcomingDueBooks = [
    {
      key: "1",
      title: "Node.js Guide",
      borrowedDate: "2025-02-10",
      dueDate: "2025-02-22",
    },
    {
      key: "2",
      title: "React for Beginners",
      borrowedDate: "2025-02-12",
      dueDate: "2025-02-25",
    },
    {
      key: "3",
      title: "Spring Boot in Action",
      borrowedDate: "2025-02-15",
      dueDate: "2025-02-27",
    },
    {
      key: "4",
      title: "Database Design",
      borrowedDate: "2025-02-18",
      dueDate: "2025-02-28",
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
          Sách sắp đến hạn trả
        </Typography.Title>
      }
      style={{
        marginBottom: 20,
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(135deg, #F9F9F9 0%, #E5E5E5 100%)",
      }}
    >
      {upcomingDueBooks.length > 0 ? (
        <Table
          columns={columns}
          dataSource={upcomingDueBooks}
          pagination={false}
        />
      ) : (
        <Typography.Text
          strong
          style={{ display: "block", textAlign: "center", fontSize: 16 }}
        >
          Bạn không có sách nào sắp đến hạn trả !!!
        </Typography.Text>
      )}
    </Card>
  );
}

export default ListCloseToDueBook;
