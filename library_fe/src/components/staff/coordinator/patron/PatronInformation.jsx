import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Tag,
  Skeleton,
  Badge,
  notification,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  TagOutlined,
  IdcardOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import patronService from "/src/services/coordinator/patronService.js";
import styles from "/src/styles/members/PatronInformation.module.css";
import { useParams } from "react-router-dom";

const { Text, Title } = Typography;
const { Option } = Select;

const PatronInformation = () => {
  const [patron, setPatron] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { patronID } = useParams();

  // Lấy dữ liệu bạn đọc
  useEffect(() => {
    const fetchPatronData = async () => {
      try {
        setLoading(true);
        const response = await patronService.getPatronDetails(patronID);

        if (response.success) {
          setPatron(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải thông tin bạn đọc",
          });
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    if (patronID) {
      fetchPatronData();
    }
  }, [patronID]);

  // Hàm chuyển đổi định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Lấy màu cho tag hạng thành viên
  const getMembershipColor = (type) => {
    switch (type) {
      case "Vàng":
        return "gold";
      case "Bạc":
        return "silver";
      case "Đồng":
        return "bronze";
      default:
        return "default";
    }
  };

  // Hiển thị trạng thái
  const getStatusBadge = (status) => {
    if (status === "Hoạt động") {
      return <Badge status="success" text="Hoạt động" />;
    } else if (status === "Tạm khóa") {
      return <Badge status="warning" text="Tạm khóa" />;
    } else {
      return <Badge status="error" text="Vô hiệu" />;
    }
  };

  // Chuyển đổi giới tính
  const getGenderText = (gender) => {
    return gender === "Nam" ? "Nam" : gender === "Nữ" ? "Nữ" : "Khác";
  };

  // Chuyển đổi role
  const getRoleText = (role) => {
    switch (role) {
      case "STUDENT":
        return "Sinh viên";
      case "TEACHER":
        return "Giảng viên";
      case "STAFF":
        return "Nhân viên";
      case "RESEARCHER":
        return "Nghiên cứu sinh";
      case "PATRON":
        return "Bạn đọc";
      default:
        return role;
    }
  };

  // Mở modal chỉnh sửa
  const showEditModal = () => {
    // Đặt giá trị mặc định cho form
    if (patron) {
      form.setFieldsValue({
        userID: patron.patronID,
        fullName: patron.patronName,
        status: patron.patronStatus,
        dob: patron.dob ? moment(patron.dob) : null,
        gender: patron.gender,
        memberPoints: patron.memberPoints,
        role: patron.role,
        plusDays: 0, // Mặc định là 0 ngày
      });
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Chuyển đổi định dạng ngày tháng
      if (values.dob) {
        values.dob = values.dob.format("YYYY-MM-DD");
      }

      // Nếu plusDays là 0 hoặc empty, loại bỏ khỏi payload
      if (!values.plusDays) {
        delete values.plusDays;
      }

      setSubmitLoading(true);

      const response = await patronService.updatePatronInfo(values);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description:
            response.message || "Cập nhật thông tin bạn đọc thành công",
        });

        // Đóng modal
        setIsModalVisible(false);

        // Tải lại thông tin bạn đọc
        const refreshResponse = await patronService.getPatronDetails(patronID);
        if (refreshResponse.success) {
          setPatron(refreshResponse.data);
        }
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể cập nhật thông tin bạn đọc",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin bạn đọc",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={styles.patronInfoContainer}>
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      ) : patron ? (
        <Card
          className={styles.patronCard}
          bordered={false}
          extra={
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showEditModal}
            >
              Chỉnh sửa
            </Button>
          }
        >
          <div className={styles.cardHeader}>
            <Avatar
              size={100}
              src={patron.patronImage}
              icon={!patron.patronImage && <UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.headerInfo}>
              <Title level={3} className={styles.patronName}>
                {patron.patronName}
              </Title>
              <div className={styles.patronTags}>
                <Tag
                  color={getMembershipColor(patron.membershipType)}
                  icon={<TrophyOutlined />}
                >
                  Hạng {patron.membershipType}
                </Tag>
                <Tag color="blue" icon={<TagOutlined />}>
                  {getRoleText(patron.role)}
                </Tag>
                {getStatusBadge(patron.patronStatus)}
              </div>
            </div>
          </div>

          <Row gutter={[24, 16]} className={styles.patronDetails}>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <IdcardOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Mã bạn đọc</Text>
                  <div>{patron.patronID}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <MailOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Email</Text>
                  <div>{patron.patronEmail}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <UserOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Giới tính</Text>
                  <div>{getGenderText(patron.gender)}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <CalendarOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Ngày sinh</Text>
                  <div>{formatDate(patron.dob)}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <TrophyOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Điểm thành viên</Text>
                  <div className={styles.pointsValue}>
                    {patron.memberPoints} điểm
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <CalendarOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Ngày tạo</Text>
                  <div>{formatDate(patron.createdAt)}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className={styles.infoItem}>
                <CalendarOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary">Ngày hết hạn</Text>
                  <div>{formatDate(patron.expiry)}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      ) : (
        <div className={styles.noData}>Không tìm thấy thông tin bạn đọc</div>
      )}

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        title="Chỉnh sửa thông tin bạn đọc"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitLoading}
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            userID: patron?.patronID,
            fullName: patron?.patronName,
            status: patron?.patronStatus,
            dob: patron?.dob ? moment(patron.dob) : null,
            gender: patron?.gender,
            memberPoints: patron?.memberPoints,
            role: patron?.role,
            plusDays: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userID"
                label="Mã bạn đọc"
                rules={[
                  { required: true, message: "Vui lòng nhập mã bạn đọc" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select>
                  <Option value="Hoạt động">Hoạt động</Option>
                  <Option value="Không hoạt động">Không hoạt động</Option>
                  <Option value="Bị cấm">Bị cấm</Option>
                  <Option value="Hết hạn">Hết hạn</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
              >
                <Select>
                  <Option value="TEACHER">Giảng viên</Option>
                  <Option value="STUDENT">Sinh viên</Option>
                  <Option value="RESEARCHER">Nghiên cứu sinh</Option>
                  <Option value="PATRON">Bạn đọc</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberPoints"
                label="Điểm thành viên"
                rules={[
                  { required: true, message: "Vui lòng nhập điểm thành viên" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plusDays"
                label="Gia hạn thêm (ngày)"
                tooltip="Số ngày gia hạn thêm cho tài khoản, để trống nếu không cần gia hạn"
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {patron?.expiry && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                Ngày hết hạn hiện tại: {formatDate(patron.expiry)}
              </Text>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PatronInformation;
