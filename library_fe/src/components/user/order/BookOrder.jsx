import { useState } from "react";
import { Table, Button, Modal, Tag, Empty, Card, Typography } from "antd";

const BookingList = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      user: "Nguyen Van A",
      date: "2025-02-25",
      book: "React Basics",
      status: "Đang chờ",
    },
    {
      id: 2,
      user: "Le Thi B",
      date: "2025-02-24",
      book: "Spring Boot",
      status: "Đã mượn",
    },
  ]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const statusColors = {
    "Đang chờ": "blue",
    "Đã mượn": "green",
    "Hết hạn": "red",
    "Đã hủy": "gray",
  };

  const handleCancelBooking = (id) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "Đã hủy" } : b))
    );
    setModalVisible(false);
  };

  const columns = [
    { title: "Người đặt", dataIndex: "user", key: "user" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Tên sách", dataIndex: "book", key: "book" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.status === "Đang chờ" ? (
          <Button
            type="link"
            onClick={() => {
              setSelectedBook(record);
              setModalVisible(true);
            }}
          >
            Hủy đặt sách
          </Button>
        ) : null,
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Danh sách sách đã đặt
        </Typography.Title>
      }
      style={{
        textAlign: "center",
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        marginTop: "20px",
      }}
    >
      {bookings.length > 0 ? (
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 3 }}
        />
      ) : (
        <Empty description="Bạn chưa đặt mượn cuốn sách nào" />
      )}
      <Modal
        title="Xác nhận hủy"
        open={modalVisible}
        onOk={() => handleCancelBooking(selectedBook?.id)}
        onCancel={() => setModalVisible(false)}
      >
        <p>
          Bạn có muốn hủy đặt cuốn sách <strong>{selectedBook?.book}</strong>{" "}
          không?
        </p>
      </Modal>
    </Card>
  );
};

export default BookingList;
