// src/components/user/event/RegisteredEvents.jsx
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import eventService from "/src/services/patron/eventService";

const { Title, Text, Paragraph } = Typography;

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [unregistering, setUnregistering] = useState(false);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getRegisteredEvents();

      if (response.success) {
        setEvents(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách sự kiện đã đăng ký",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error fetching registered events:", error);
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

  const handleUnregister = async () => {
    try {
      setUnregistering(true);
      const response = await eventService.unregisterEvent(
        selectedEvent.eventID
      );

      if (response.success) {
        notification.success({
          message: "Hủy đăng ký thành công",
          description: response.message,
          placement: "bottomRight",
        });
        fetchRegisteredEvents(); // Refresh events list
      } else {
        notification.error({
          message: "Hủy đăng ký thất bại",
          description: response.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error unregistering from event:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setUnregistering(false);
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

  // Get registration status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã đăng ký":
        return "blue";
      case "Đã tham gia":
        return "green";
      case "Đã hủy đăng ký":
        return "orange";
      case "Không tham gia":
        return "red";
      default:
        return "default";
    }
  };

  // Determine if an event is upcoming based on its end time
  const isUpcomingEvent = (endTime) => {
    const now = new Date();
    const eventEndTime = new Date(endTime);
    return eventEndTime > now;
  };

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (text) => <div style={{ fontWeight: "bold" }}>{text}</div>,
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
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
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
        isUpcomingEvent(record.endTime) && record.status === "Đã đăng ký" ? (
          <Button danger onClick={() => showModal(record)}>
            Hủy đăng ký
          </Button>
        ) : null,
    },
  ];

  return (
    <Card
      title={
        <div style={{ textAlign: "center" }}>
          <CheckCircleOutlined style={{ fontSize: 24, marginRight: 8 }} />
          <Title
            level={3}
            style={{ margin: 0, display: "inline-block", color: "white" }}
          >
            Sự kiện đã đăng ký
          </Title>
        </div>
      }
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      headStyle={{
        background: "linear-gradient(135deg, #52c41a 0%, #1890ff 100%)",
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
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showQuickJumper: false,
            simple: true,
          }}
          rowKey="eventID"
        />
      ) : (
        <Empty description="Bạn chưa đăng ký tham gia sự kiện nào" />
      )}

      <Modal
        title={
          <div>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Chi tiết sự kiện đã đăng ký
          </div>
        }
        open={isModalVisible}
        onOk={
          isUpcomingEvent(selectedEvent?.endTime) &&
          selectedEvent?.status === "Đã đăng ký"
            ? handleUnregister
            : handleCancel
        }
        onCancel={handleCancel}
        okText={
          isUpcomingEvent(selectedEvent?.endTime) &&
          selectedEvent?.status === "Đã đăng ký"
            ? "Hủy đăng ký"
            : "Đóng"
        }
        okButtonProps={{
          danger:
            isUpcomingEvent(selectedEvent?.endTime) &&
            selectedEvent?.status === "Đã đăng ký",
          style: {
            display:
              isUpcomingEvent(selectedEvent?.endTime) &&
              selectedEvent?.status === "Đã đăng ký"
                ? "inline-block"
                : "none",
          },
        }}
        cancelText="Đóng"
        confirmLoading={unregistering}
      >
        {selectedEvent && (
          <div>
            <Title level={4}>{selectedEvent.title}</Title>
            <div style={{ margin: "16px 0" }}>
              <Tag color={getStatusColor(selectedEvent.status)}>
                {selectedEvent.status}
              </Tag>
              <Tag
                color={
                  isUpcomingEvent(selectedEvent.endTime) ? "green" : "blue"
                }
              >
                {isUpcomingEvent(selectedEvent.endTime)
                  ? "Sắp diễn ra"
                  : "Đã diễn ra"}
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

            {isUpcomingEvent(selectedEvent.endTime) &&
              selectedEvent.status === "Đã đăng ký" && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    background: "#fff2e8",
                    border: "1px solid #ffbb96",
                    borderRadius: 4,
                  }}
                >
                  <Text>
                    Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này?
                  </Text>
                </div>
              )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default RegisteredEvents;
