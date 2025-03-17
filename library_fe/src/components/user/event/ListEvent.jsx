// src/components/user/event/ListEvent.jsx
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Tag,
  Typography,
  notification,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import eventService from "/src/services/patron/eventService";

const { Title, Text, Paragraph } = Typography;

const ListEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();

      if (response.success) {
        setEvents(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách sự kiện",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const showModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await eventService.registerEvent(selectedEvent.eventID);

      if (response.success) {
        notification.success({
          message: "Đăng ký thành công",
          description: response.message,
          placement: "bottomRight",
        });
        fetchEvents(); // Refresh events list
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: response.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setRegistering(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Format date and time from ISO to readable format
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ fontWeight: "bold" }}>
          {text}
          {record.status === "Sắp diễn ra" && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              Sắp diễn ra
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            <Text>{formatDateTime(record.startTime)}</Text>
          </div>
          <div>
            <Text type="secondary">đến {formatDateTime(record.endTime)}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <Text>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {text}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "Sắp diễn ra"
            ? "green"
            : status === "Đã diễn ra"
            ? "blue"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thông tin",
      key: "info",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => showModal(record)}
          />
        </Tooltip>
      ),
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
        <div style={{ textAlign: "center" }}>
          <CalendarOutlined style={{ fontSize: 24, marginRight: 8 }} />
          <Title
            level={3}
            style={{ margin: 0, display: "inline-block", color: "white" }}
          >
            Sự kiện thư viện
          </Title>
        </div>
      }
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      headStyle={{
        background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
        color: "white",
        borderRadius: "12px 12px 0 0",
        padding: "16px",
      }}
      bodyStyle={{
        padding: "24px",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
        </div>
      ) : events.length > 0 ? (
        <Table
          columns={columns}
          dataSource={events.map((event) => ({ ...event, key: event.eventID }))}
          pagination={{ pageSize: 5 }}
          rowClassName={(record) =>
            record.status === "Sắp diễn ra" ? "upcoming-event-row" : ""
          }
        />
      ) : (
        <Empty description="Chưa có sự kiện nào" />
      )}

      <Modal
        title={
          <div>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Chi tiết sự kiện
          </div>
        }
        open={isModalVisible}
        onOk={
          selectedEvent?.status === "Sắp diễn ra"
            ? handleRegister
            : handleCancel
        }
        onCancel={handleCancel}
        okText={
          selectedEvent?.status === "Sắp diễn ra" ? "Đăng ký tham gia" : "Đóng"
        }
        cancelText="Hủy"
        confirmLoading={registering}
        cancelButtonProps={{
          style: {
            display:
              selectedEvent?.status === "Sắp diễn ra" ? "inline-block" : "none",
          },
        }}
      >
        {selectedEvent && (
          <div>
            <Title level={4}>{selectedEvent.title}</Title>
            <div style={{ margin: "16px 0" }}>
              <Tag
                color={
                  selectedEvent.status === "Sắp diễn ra"
                    ? "green"
                    : selectedEvent.status === "Đã diễn ra"
                    ? "blue"
                    : "red"
                }
              >
                {selectedEvent.status}
              </Tag>
            </div>

            <div style={{ margin: "8px 0" }}>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              <Text strong>Thời gian:</Text>
              <div style={{ marginLeft: 24 }}>
                <Text>Bắt đầu: {formatDateTime(selectedEvent.startTime)}</Text>
                <br />
                <Text>Kết thúc: {formatDateTime(selectedEvent.endTime)}</Text>
              </div>
            </div>

            <div style={{ margin: "8px 0" }}>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              <Text strong>Địa điểm:</Text> {selectedEvent.location}
            </div>

            <div style={{ margin: "16px 0" }}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              <Text strong>Mô tả:</Text>
              <Paragraph style={{ marginLeft: 24, marginTop: 8 }}>
                {selectedEvent.description}
              </Paragraph>
            </div>

            {selectedEvent.status === "Sắp diễn ra" && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 4,
                }}
              >
                <Text>Bạn có muốn đăng ký tham gia sự kiện này?</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ListEvent;
