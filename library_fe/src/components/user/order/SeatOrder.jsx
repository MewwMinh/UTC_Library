import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Empty,
  Card,
  Form,
  DatePicker,
  TimePicker,
  Select,
} from "antd";

const { Option } = Select;

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelType, setCancelType] = useState("");

  const [seats, setSeats] = useState([
    {
      id: 1,
      seatType: "Bàn nhóm 4 người",
      date: "2025-02-26",
      time: "10:00",
      status: "Đang chờ",
    },
    {
      id: 2,
      seatType: "Chỗ ngồi cá nhân",
      date: "2025-02-27",
      time: "14:00",
      status: "Chấp nhận",
    },
  ]);

  const statusColors = {
    "Đang chờ": "blue",
    "Đã mượn": "green",
    "Hết hạn": "red",
    "Đã hủy": "gray",
    "Chấp nhận": "green",
    "Từ chối": "red",
  };

  const handleCancel = () => {
    if (cancelType === "book") {
      setBookings(
        bookings.map((b) =>
          b.id === selectedItem.id ? { ...b, status: "Đã hủy" } : b
        )
      );
    } else {
      setSeats(
        seats.map((s) =>
          s.id === selectedItem.id ? { ...s, status: "Đã hủy" } : s
        )
      );
    }
    setModalVisible(false);
  };

  const handleSeatBooking = (values) => {
    setSeats([
      ...seats,
      { id: seats.length + 1, ...values, status: "Đang chờ" },
    ]);
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
      <Card
        title="Đặt chỗ tại thư viện"
        style={{
          flex: 1,
          background:
            "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        }}
      >
        <Form layout="vertical" onFinish={handleSeatBooking}>
          <Form.Item
            name="seatType"
            label="Loại chỗ"
            rules={[{ required: true, message: "Vui lòng chọn loại chỗ!" }]}
          >
            <Select>
              <Option value="Chỗ ngồi cá nhân">Chỗ ngồi cá nhân</Option>
              <Option value="Bàn nhóm 4 người">Bàn nhóm 4 người</Option>
              <Option value="Bàn nhóm 7 người">Bàn nhóm 7 người</Option>
              <Option value="Bàn nhóm 15 người">Bàn nhóm 15 người</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày đặt"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="time"
            label="Giờ đặt"
            rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Đặt chỗ
          </Button>
        </Form>
      </Card>
      <Card
        title="Lịch sử đặt chỗ"
        style={{
          flex: 1,
          background:
            "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        }}
      >
        {seats.length > 0 ? (
          <Table
            dataSource={seats}
            columns={[
              { title: "Loại chỗ", dataIndex: "seatType", key: "seatType" },
              { title: "Ngày", dataIndex: "date", key: "date" },
              { title: "Giờ", dataIndex: "time", key: "time" },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <Tag color={statusColors[status]}>{status}</Tag>
                ),
              },
              {
                title: "Hành động",
                key: "action",
                render: (_, record) =>
                  record.status === "Đang chờ" ? (
                    <Button
                      type="link"
                      onClick={() => {
                        setSelectedItem(record);
                        setCancelType("seat");
                        setModalVisible(true);
                      }}
                    >
                      Hủy đặt chỗ
                    </Button>
                  ) : null,
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Empty description="Hiện tại bạn chưa đặt chỗ" />
        )}
      </Card>
      <Modal
        title="Xác nhận hủy"
        open={modalVisible}
        onOk={handleCancel}
        onCancel={() => setModalVisible(false)}
      >
        <p>
          Bạn có muốn hủy{" "}
          {cancelType === "book"
            ? `đặt cuốn sách ${selectedItem?.book}`
            : `đặt chỗ ${selectedItem?.seatType} vào ngày ${selectedItem?.date}, ${selectedItem?.time}`}{" "}
          không?
        </p>
      </Modal>
    </div>
  );
};

export default BookingList;
