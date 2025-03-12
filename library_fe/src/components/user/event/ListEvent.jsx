import { useState } from "react";
import { Card, Table, Button, Modal, Tag, Typography } from "antd";

const eventData = [
  {
    key: "1",
    name: "Hội thảo Công nghệ AI",
    description: "Giới thiệu về AI và các ứng dụng thực tế.",
    startTime: "2025-03-10 10:00",
    endTime: "2025-03-10 12:00",
    location: "Hội trường A1",
    status: "Sắp diễn ra",
  },
  {
    key: "2",
    name: "Hội chợ Sách 2025",
    description: "Trưng bày và giới thiệu các đầu sách mới.",
    startTime: "2025-02-15 09:00",
    endTime: "2025-02-15 17:00",
    location: "Nhà văn hóa TP",
    status: "Đã kết thúc",
  },
  {
    key: "3",
    name: "Cuộc thi Lập trình Hackathon",
    description: "Cuộc thi lập trình dành cho sinh viên CNTT.",
    startTime: "2025-04-20 08:00",
    endTime: "2025-04-20 18:00",
    location: "Trung tâm CNTT",
    status: "Sắp diễn ra",
  },
  {
    key: "4",
    name: "Diễn đàn Khởi nghiệp 2025",
    description: "Nơi giao lưu của các startup và nhà đầu tư.",
    startTime: "2025-01-25 14:00",
    endTime: "2025-01-25 17:00",
    location: "Khách sạn Grand",
    status: "Đã kết thúc",
  },
  {
    key: "5",
    name: "Hội thảo An toàn Thông tin",
    description: "Bảo vệ dữ liệu và an ninh mạng.",
    startTime: "2025-05-10 09:00",
    endTime: "2025-05-10 12:00",
    location: "Tòa nhà Tech",
    status: "Sắp diễn ra",
  },
];

const EventCard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const showModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "Sắp diễn ra"
            ? "green"
            : status === "Đã kết thúc"
            ? "blue"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.status === "Sắp diễn ra" ? (
          <Button type="primary" onClick={() => showModal(record)}>
            Đăng ký tham gia
          </Button>
        ) : null,
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Danh sách sự kiện
        </Typography.Title>
      }
      style={{
        textAlign: "center",
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(rgba(245, 231, 236, 0.39) 0%,rgba(163, 171, 179, 0.81) 100%)",
        marginTop: "20px",
      }}
    >
      {eventData.length > 0 ? (
        <Table
          columns={columns}
          dataSource={eventData}
          pagination={{ pageSize: 3 }}
        />
      ) : (
        <p>Chưa có sự kiện nào diễn ra</p>
      )}
      <Modal
        title="Xác nhận đăng ký"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        {selectedEvent && (
          <p>
            Bạn muốn đăng ký tham gia <strong>{selectedEvent.name}</strong> vào
            lúc <strong>{selectedEvent.startTime.split(" ")[1]}</strong>, ngày{" "}
            <strong>{selectedEvent.startTime.split(" ")[0]}</strong> ?
          </p>
        )}
      </Modal>
    </Card>
  );
};

export default EventCard;
