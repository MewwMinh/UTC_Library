/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  notification,
  Popconfirm,
  Skeleton,
  Divider,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import eventService from "/src/services/coordinator/eventService.js";
import styles from "/src/styles/eventStaff/EventDetail.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const now = dayjs();

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(eventId);

      if (response.success) {
        setEvent(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải thông tin sự kiện",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = () => {
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      startTime: dayjs(event.startTime),
      endTime: dayjs(event.endTime),
      location: event.location,
      maxAttendees: event.maxAttendees,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      const eventData = {
        title: values.title,
        description: values.description,
        startTime: values.startTime.format("YYYY-MM-DDTHH:mm:ss"),
        endTime: values.endTime.format("YYYY-MM-DDTHH:mm:ss"),
        location: values.location,
        maxAttendees: values.maxAttendees,
      };

      const response = await eventService.updateEvent(eventId, eventData);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin sự kiện thành công",
        });
        setIsModalVisible(false);
        fetchEventDetails();
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể cập nhật thông tin sự kiện",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await eventService.deleteEvent(eventId);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Xóa sự kiện thành công",
        });
        navigate("/staff/events");
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể xóa sự kiện",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Function to determine event status
  const getEventStatus = () => {
    if (!event) return null;

    const startTime = dayjs(event.startTime);
    const endTime = dayjs(event.endTime);

    if (now.isAfter(endTime)) {
      return "finished"; // Đã kết thúc
    } else if (now.isAfter(startTime) && now.isBefore(endTime)) {
      return "ongoing"; // Đang diễn ra
    } else {
      return "upcoming"; // Sắp diễn ra
    }
  };

  const getEventStatusTag = () => {
    const status = getEventStatus();
    if (status === "finished") {
      return <Tag color="default">Đã kết thúc</Tag>;
    } else if (status === "ongoing") {
      return <Tag color="processing">Đang diễn ra</Tag>;
    } else {
      return <Tag color="success">Sắp diễn ra</Tag>;
    }
  };

  if (loading) {
    return (
      <Card className={styles.container}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!event) {
    return (
      <Card className={styles.container}>
        <Typography.Title level={4}>
          Không tìm thấy thông tin sự kiện
        </Typography.Title>
      </Card>
    );
  }

  // Render statistics based on event status
  const renderStatistics = () => {
    const status = getEventStatus();

    if (status === "finished") {
      // Đã kết thúc: hiển thị số người tối đa và số người đã tham gia
      return (
        <div className={styles.statistics}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{event.maxAttendees}</div>
            <div className={styles.statLabel}>Số người tối đa</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{event.eventAttendeeCount}</div>
            <div className={styles.statLabel}>Đã tham gia</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {event.maxAttendees > 0
                ? Math.round(
                    (event.eventAttendeeCount / event.maxAttendees) * 100
                  )
                : 0}
              %
            </div>
            <div className={styles.statLabel}>Tỷ lệ tham gia</div>
          </div>
        </div>
      );
    } else if (status === "ongoing") {
      // Đang diễn ra: hiển thị cả đã đăng ký và đã tham gia
      return (
        <div className={styles.statistics}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{event.maxAttendees}</div>
            <div className={styles.statLabel}>Số người tối đa</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {event.registeredParticipantCount}
            </div>
            <div className={styles.statLabel}>Đã đăng ký</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{event.eventAttendeeCount}</div>
            <div className={styles.statLabel}>Đã tham gia</div>
          </div>
        </div>
      );
    } else {
      // Sắp diễn ra: hiển thị số người tối đa và số đăng ký
      return (
        <div className={styles.statistics}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{event.maxAttendees}</div>
            <div className={styles.statLabel}>Số người tối đa</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {event.registeredParticipantCount}
            </div>
            <div className={styles.statLabel}>Đã đăng ký</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {event.maxAttendees > 0
                ? Math.round(
                    (event.registeredParticipantCount / event.maxAttendees) *
                      100
                  )
                : 0}
              %
            </div>
            <div className={styles.statLabel}>Tỷ lệ đăng ký</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.title}>
            {event.title}
          </Title>
          {getEventStatusTag()}
        </div>
        <div className={styles.actionButtons}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={showEditModal}
            className={styles.editButton}
          >
            Sửa thông tin
          </Button>
          <Popconfirm
            title="Xóa sự kiện"
            description="Bạn có chắc chắn muốn xóa sự kiện này không?"
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            >
              Xóa sự kiện
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className={styles.timeInfo}>
        <CalendarOutlined className={styles.timeIcon} />
        <Text strong>Thời gian:</Text>
        <Text>
          {formatDate(event.startTime)} - {formatDate(event.endTime)}
        </Text>
      </div>

      <div className={styles.locationInfo}>
        <EnvironmentOutlined className={styles.locationIcon} />
        <Text strong>Địa điểm:</Text>
        <Text>{event.location}</Text>
      </div>

      <Divider />

      <div className={styles.infoSection}>
        <Title level={4} className={styles.descriptionHeader}>
          Mô tả sự kiện
        </Title>
        <Paragraph className={styles.description}>
          {event.description}
        </Paragraph>
      </div>

      <Divider />

      {renderStatistics()}

      {/* Edit Event Modal */}
      <Modal
        title="Sửa thông tin sự kiện"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          className={styles.modalForm}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề sự kiện" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề sự kiện" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sự kiện" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sự kiện" />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian bắt đầu" },
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn thời gian bắt đầu"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian kết thúc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue("startTime")) {
                    return Promise.resolve();
                  }
                  if (value.isAfter(getFieldValue("startTime"))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Thời gian kết thúc phải sau thời gian bắt đầu")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn thời gian kết thúc"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
          >
            <Input placeholder="Nhập địa điểm" />
          </Form.Item>

          <Form.Item
            name="maxAttendees"
            label="Số người tối đa"
            rules={[
              { required: true, message: "Vui lòng nhập số người tối đa" },
              {
                type: "number",
                min: 1,
                message: "Số người tối đa phải lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Nhập số người tối đa"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div className={styles.formButtons}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.editButton}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default EventDetail;
