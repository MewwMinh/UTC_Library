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
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import eventService from "/src/services/patron/eventService";
import "dayjs/locale/vi";
import locale from "antd/lib/date-picker/locale/vi_VN";
import styles from "/src/styles/events/ListEvent.module.css";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ListEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  // Filters state
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, searchText, dateRange, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();

      if (response.success) {
        // Thêm trạng thái dựa trên thời gian
        const eventsWithStatus = (response.data || []).map((event) => ({
          ...event,
          computedStatus: getEventStatus(event.startTime, event.endTime),
        }));

        setEvents(eventsWithStatus);
        setFilteredEvents(eventsWithStatus);
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

  // Hàm tính toán trạng thái của sự kiện dựa vào thời gian
  const getEventStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return "Sắp diễn ra";
    } else if (now > end) {
      return "Đã diễn ra";
    } else {
      return "Đang diễn ra";
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

    // Apply status filter - sử dụng computedStatus thay vì status
    if (statusFilter) {
      result = result.filter((event) => event.computedStatus === statusFilter);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Sắp diễn ra":
        return "green";
      case "Đang diễn ra":
        return "gold";
      case "Đã diễn ra":
        return "blue";
      case "Đã hủy":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className={styles.eventTitle}>
          {text}
          {record.computedStatus === "Sắp diễn ra" && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              Sắp diễn ra
            </Tag>
          )}
          {record.computedStatus === "Đang diễn ra" && (
            <Tag color="gold" style={{ marginLeft: 8 }}>
              Đang diễn ra
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
            <ClockCircleOutlined className={styles.eventTime} />
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
          <EnvironmentOutlined className={styles.iconMargin} />
          {text}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "computedStatus",
      key: "computedStatus",
      render: (status) => {
        const color = getStatusColor(status);
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
        record.computedStatus === "Sắp diễn ra" ? (
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
          <CalendarOutlined
            className={styles.iconMargin}
            style={{ fontSize: 24 }}
          />
          <Title level={3} className={styles.cardTitle}>
            Sự kiện thư viện
          </Title>
        </div>
      }
      className={styles.eventCard}
      styles={{
        header: {
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
          padding: "16px",
        },
        body: { padding: "24px" },
      }}
    >
      {/* Filter section */}
      <Card
        size="small"
        className={styles.filterCard}
        variant="borderless"
        styles={{
          body: { padding: "16px" },
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
                placeholder="Trạng thái sự kiện"
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
              >
                <Option value="Sắp diễn ra">Sắp diễn ra</Option>
                <Option value="Đang diễn ra">Đang diễn ra</Option>
                <Option value="Đã diễn ra">Đã diễn ra</Option>
                <Option value="Đã hủy">Đã hủy</Option>
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
          ? `Tất cả sự kiện (${events.length})`
          : `Kết quả tìm kiếm (${filteredEvents.length}/${events.length})`}
      </Divider>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <div className={styles.loadingText}>Đang tải dữ liệu...</div>
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
          rowClassName={(record) =>
            record.computedStatus === "Sắp diễn ra"
              ? styles.upcomingEventRow
              : ""
          }
        />
      ) : (
        <Empty
          description={
            events.length > 0
              ? "Không tìm thấy sự kiện phù hợp với bộ lọc"
              : "Chưa có sự kiện nào"
          }
        />
      )}

      <Modal
        title={
          <div>
            <CalendarOutlined className={styles.iconMargin} />
            Chi tiết sự kiện
          </div>
        }
        open={isModalVisible}
        onOk={
          selectedEvent?.computedStatus === "Sắp diễn ra"
            ? handleRegister
            : handleCancel
        }
        onCancel={handleCancel}
        okText={
          selectedEvent?.computedStatus === "Sắp diễn ra"
            ? "Đăng ký tham gia"
            : "Đóng"
        }
        cancelText="Hủy"
        confirmLoading={registering}
        cancelButtonProps={{
          style: {
            display:
              selectedEvent?.computedStatus === "Sắp diễn ra"
                ? "inline-block"
                : "none",
          },
        }}
      >
        {selectedEvent && (
          <div>
            <Title level={4}>{selectedEvent.title}</Title>
            <div style={{ margin: "16px 0" }}>
              <Tag color={getStatusColor(selectedEvent.computedStatus)}>
                {selectedEvent.computedStatus}
              </Tag>
            </div>

            <div className={styles.modalContentSection}>
              <ClockCircleOutlined className={styles.iconMargin} />
              <Text strong>Thời gian:</Text>
              <div className={styles.modalDetailText}>
                <Text>Bắt đầu: {formatDateTime(selectedEvent.startTime)}</Text>
                <br />
                <Text>Kết thúc: {formatDateTime(selectedEvent.endTime)}</Text>
              </div>
            </div>

            <div className={styles.modalContentSection}>
              <EnvironmentOutlined className={styles.iconMargin} />
              <Text strong>Địa điểm:</Text> {selectedEvent.location}
            </div>

            <div style={{ margin: "16px 0" }}>
              <InfoCircleOutlined className={styles.iconMargin} />
              <Text strong>Mô tả:</Text>
              <Paragraph className={styles.modalDescription}>
                {selectedEvent.description}
              </Paragraph>
            </div>

            {selectedEvent.computedStatus === "Sắp diễn ra" && (
              <div className={styles.eventInfoMessage}>
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
