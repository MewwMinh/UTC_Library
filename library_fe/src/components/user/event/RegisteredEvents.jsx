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
  Space,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import eventService from "/src/services/patron/eventService";
import "dayjs/locale/vi";
import locale from "antd/lib/date-picker/locale/vi_VN";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [unregistering, setUnregistering] = useState(false);

  // Filters state
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, searchText, dateRange, statusFilter]);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getRegisteredEvents();

      if (response.success) {
        setEvents(response.data || []);
        setFilteredEvents(response.data || []);
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

  const applyFilters = () => {
    let result = [...events];

    // Apply search filter
    if (searchText) {
      result = result.filter((event) =>
        event.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day").toISOString();
      const endDate = dateRange[1].endOf("day").toISOString();

      result = result.filter((event) => {
        const eventStartTime = new Date(event.startTime).toISOString();
        return eventStartTime >= startDate && eventStartTime <= endDate;
      });
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(result);
  };

  const resetFilters = () => {
    setSearchText("");
    setDateRange(null);
    setStatusFilter(null);
    setFilteredEvents(events);
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
      styles={{
        header: {
          background: "linear-gradient(135deg, #52c41a 0%, #1890ff 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
          padding: "16px",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      {/* Filter section */}
      <Card
        size="small"
        style={{ marginBottom: 16, borderRadius: 8 }}
        variant="borderless"
        styles={{
          body: { padding: 16 },
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Input
              placeholder="Tìm kiếm theo tên sự kiện"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
              locale={locale}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Space>
              <Select
                placeholder="Trạng thái đăng ký"
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
              >
                <Option value="Đã đăng ký">Đã đăng ký</Option>
                <Option value="Đã tham gia">Đã tham gia</Option>
                <Option value="Đã hủy đăng ký">Đã hủy đăng ký</Option>
                <Option value="Không tham gia">Không tham gia</Option>
              </Select>
              <Tooltip title="Làm mới bộ lọc">
                <Button icon={<ReloadOutlined />} onClick={resetFilters} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      <Divider>
        <FilterOutlined />
        {filteredEvents.length === events.length
          ? `Tất cả sự kiện đã đăng ký (${events.length})`
          : `Kết quả tìm kiếm (${filteredEvents.length}/${events.length})`}
      </Divider>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredEvents.map((event) => ({
            ...event,
            key: event.eventID,
          }))}
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sự kiện`,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          rowKey="eventID"
          rowClassName={(record) => {
            if (
              record.status === "Đã đăng ký" &&
              isUpcomingEvent(record.endTime)
            ) {
              return "upcoming-registered-event-row";
            }
            return "";
          }}
        />
      ) : (
        <Empty
          description={
            events.length > 0
              ? "Không tìm thấy sự kiện phù hợp với bộ lọc"
              : "Bạn chưa đăng ký tham gia sự kiện nào"
          }
        />
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
