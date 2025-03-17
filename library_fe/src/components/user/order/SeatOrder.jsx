import { useState, useEffect } from "react";
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
  Typography,
  Row,
  Col,
  notification,
  Spin,
  Drawer,
  Descriptions,
  Space,
  Alert,
} from "antd";
import {
  FieldTimeOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  LaptopOutlined,
  SoundOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import orderService from "/src/services/patron/orderService";
import "./order.css";

const { Option } = Select;
const { Title, Text } = Typography;

const SeatOrder = () => {
  const [form] = Form.useForm();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(null);

  const fetchSeatReservations = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllSeatReservations();
      if (response.success) {
        setSeats(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách đặt chỗ",
        });
      }
    } catch (error) {
      console.error("Error fetching seat reservations:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatReservations();
  }, []);

  const statusColors = {
    "Đang chờ xử lý": "processing",
    "Đã hủy đặt chỗ": "default",
    "Đồng ý": "success",
    "Từ chối": "error",
  };

  const statusIcons = {
    "Đang chờ xử lý": <ClockCircleOutlined />,
    "Đã hủy đặt chỗ": <CloseCircleOutlined />,
    "Đồng ý": <CheckCircleOutlined />,
    "Từ chối": <ExclamationCircleOutlined />,
  };

  const handleCancel = async () => {
    try {
      const response = await orderService.cancelSeatReservation(
        selectedItem.reservationID
      );
      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message,
        });
        setModalVisible(false);
        // Refetch to update the list
        fetchSeatReservations();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể hủy đặt chỗ",
        });
      }
    } catch (error) {
      console.error("Error canceling seat reservation:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    }
  };

  const handleSeatBooking = async (values) => {
    try {
      setSubmitting(true);
      // Format the date and time to match the expected format
      const reservationTime =
        values.date.format("YYYY-MM-DD") + "T" + values.time.format("HH:mm:00");

      const payload = {
        seatType: values.seatType,
        reservationTime: reservationTime,
      };

      const response = await orderService.reserveSeat(payload);

      if (response.success) {
        notification.success({
          message: "Đặt chỗ thành công",
          description: response.message,
        });
        form.resetFields();
        fetchSeatReservations();
      } else {
        notification.error({
          message: "Lỗi đặt chỗ",
          description:
            response.message || "Không thể đặt chỗ. Vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const showDetails = (record) => {
    setCurrentSeat(record);
    setDetailVisible(true);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Function to get appropriate icon for seat type
  const getSeatTypeIcon = (seatType) => {
    if (seatType.includes("nhóm") || seatType.includes("Phòng")) {
      return <TeamOutlined />;
    } else if (seatType.includes("máy tính") || seatType.includes("Computer")) {
      return <LaptopOutlined />;
    } else if (seatType.includes("yên tĩnh") || seatType.includes("Silent")) {
      return <SoundOutlined />;
    } else if (seatType.includes("cửa sổ") || seatType.includes("Window")) {
      return <EnvironmentOutlined />;
    } else {
      return <UserOutlined />;
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card
            title={
              <div style={{ textAlign: "center" }}>
                <Title level={4} style={{ margin: 0, color: "#2c6e49" }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Đặt chỗ tại thư viện
                </Title>
                <Text style={{ color: "#4c956c" }}>
                  Đặt trước chỗ ngồi để học tập và nghiên cứu
                </Text>
              </div>
            }
            headStyle={{
              background: "linear-gradient(135deg, #d8f3dc 0%, #95d5b2 100%)",
              padding: "16px",
              borderBottom: "1px solid #b7e4c7",
            }}
            style={{
              height: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              background: "#fefefe",
            }}
          >
            <Alert
              message="Hướng dẫn đặt chỗ"
              description={
                <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
                  <li>Chọn loại chỗ phù hợp với nhu cầu</li>
                  <li>Chọn ngày và thời gian bạn muốn sử dụng</li>
                  <li>Vui lòng đến đúng giờ để không mất chỗ</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginBottom: "20px" }}
            />

            <Form layout="vertical" form={form} onFinish={handleSeatBooking}>
              <Form.Item
                name="seatType"
                label="Loại chỗ ngồi"
                rules={[
                  { required: true, message: "Vui lòng chọn loại chỗ ngồi!" },
                ]}
              >
                <Select placeholder="Chọn loại chỗ ngồi">
                  <Select.OptGroup label="Chỗ ngồi cá nhân">
                    <Option value="Ghế đơn tiêu chuẩn">
                      Ghế đơn tiêu chuẩn
                    </Option>
                    <Option value="Bàn có vách ngăn">Bàn có vách ngăn</Option>
                    <Option value="Chỗ ngồi gần cửa sổ">
                      Chỗ ngồi gần cửa sổ
                    </Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="Chỗ ngồi nhóm">
                    <Option value="Bàn học nhóm">Bàn học nhóm</Option>
                    <Option value="Phòng học nhóm">Phòng học nhóm</Option>
                    <Option value="Ghế sofa & bàn tròn">
                      Ghế sofa & bàn tròn
                    </Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="Khu vực đặc biệt">
                    <Option value="Khu vực yên tĩnh">Khu vực yên tĩnh</Option>
                    <Option value="Khu vực sử dụng máy tính">
                      Khu vực sử dụng máy tính
                    </Option>
                  </Select.OptGroup>
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày đặt"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>
              <Form.Item
                name="time"
                label="Giờ đặt"
                rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  placeholder="Chọn giờ"
                  minuteStep={15}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  style={{ width: "100%" }}
                  icon={<TeamOutlined />}
                >
                  Đặt chỗ
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card
            title={
              <div style={{ textAlign: "center" }}>
                <Title level={4} style={{ margin: 0, color: "#2c6e49" }}>
                  <BookOutlined style={{ marginRight: 8 }} />
                  Lịch sử đặt chỗ
                </Title>
                <Text style={{ color: "#4c956c" }}>
                  Quản lý và theo dõi các chỗ ngồi bạn đã đặt
                </Text>
              </div>
            }
            headStyle={{
              background: "linear-gradient(135deg, #d8f3dc 0%, #95d5b2 100%)",
              padding: "16px",
              borderBottom: "1px solid #b7e4c7",
            }}
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              background: "#fefefe",
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Đang tải lịch sử đặt chỗ...</p>
              </div>
            ) : seats.length > 0 ? (
              <Table
                dataSource={seats}
                columns={[
                  {
                    title: "Loại chỗ",
                    dataIndex: "seatType",
                    key: "seatType",
                    render: (text) => {
                      const icon = getSeatTypeIcon(text);
                      return (
                        <Text>
                          {icon} {text}
                        </Text>
                      );
                    },
                  },
                  {
                    title: "Thời gian",
                    dataIndex: "reservationTime",
                    key: "reservationTime",
                    render: (text) => (
                      <Text>
                        <FieldTimeOutlined style={{ marginRight: 5 }} />
                        {formatDateTime(text)}
                      </Text>
                    ),
                    sorter: (a, b) =>
                      new Date(a.reservationTime) - new Date(b.reservationTime),
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                      <Tag
                        icon={statusIcons[status]}
                        color={statusColors[status]}
                      >
                        {status}
                      </Tag>
                    ),
                    filters: [
                      { text: "Đang chờ xử lý", value: "Đang chờ xử lý" },
                      { text: "Đồng ý", value: "Đồng ý" },
                      { text: "Từ chối", value: "Từ chối" },
                      { text: "Đã hủy đặt chỗ", value: "Đã hủy đặt chỗ" },
                    ],
                    onFilter: (value, record) => record.status === value,
                  },
                  {
                    title: "Hành động",
                    key: "action",
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="link"
                          icon={<InfoCircleOutlined />}
                          onClick={() => showDetails(record)}
                        >
                          Chi tiết
                        </Button>
                        {record.status === "Đang chờ xử lý" && (
                          <Button
                            danger
                            type="link"
                            onClick={() => {
                              setSelectedItem(record);
                              setModalVisible(true);
                            }}
                          >
                            Hủy đặt
                          </Button>
                        )}
                      </Space>
                    ),
                  },
                ]}
                rowKey="reservationID"
                pagination={{ pageSize: 5 }}
                rowClassName={(record) => {
                  if (record.status === "Đang chờ xử lý")
                    return "row-processing";
                  if (record.status === "Đồng ý") return "row-success";
                  if (record.status === "Từ chối") return "row-rejected";
                  return "";
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    Hiện tại bạn chưa đặt chỗ nào.
                    <br />
                    Hãy đặt chỗ để có không gian học tập tốt nhất!
                  </span>
                }
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <div>
            <CloseCircleOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
            Xác nhận hủy đặt chỗ
          </div>
        }
        open={modalVisible}
        onOk={handleCancel}
        onCancel={() => setModalVisible(false)}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn hủy đặt <b>{selectedItem?.seatType}</b> vào lúc{" "}
          <b>{selectedItem && formatDateTime(selectedItem.reservationTime)}</b>{" "}
          không?
        </p>
        <p>Lưu ý: Hành động này không thể hoàn tác sau khi xác nhận.</p>
      </Modal>

      <Drawer
        title={
          <span>
            <TeamOutlined style={{ marginRight: 8 }} />
            Chi tiết đặt chỗ
          </span>
        }
        placement="right"
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        width={480}
      >
        {currentSeat && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Loại chỗ">
              <Text strong>
                {getSeatTypeIcon(currentSeat.seatType)} {currentSeat.seatType}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt chỗ">
              {currentSeat.reservationID}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian đặt">
              {formatDateTime(currentSeat.reservationTime)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                icon={statusIcons[currentSeat.status]}
                color={statusColors[currentSeat.status]}
              >
                {currentSeat.status}
              </Tag>
            </Descriptions.Item>
            {currentSeat.reason && (
              <Descriptions.Item label="Lý do">
                {currentSeat.reason}
              </Descriptions.Item>
            )}
            {currentSeat.acceptBy && (
              <Descriptions.Item label="Người xử lý">
                {currentSeat.acceptBy}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>

      {/* CSS styles applied via className in Table's rowClassName prop */}
    </div>
  );
};

export default SeatOrder;
