/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  notification,
  Skeleton,
  Divider,
  Row,
  Col,
  Tag,
  Space,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import employeeService from "/src/services/manager/employeeService.js";
import styles from "/src/styles/manager/manage-employee/EmployeeDetail.module.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const EmployeeDetail = () => {
  const { userId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch employee data
  const fetchEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployeeById(userId);

      if (response.success) {
        setEmployee(response.data);
        form.setFieldsValue({
          userName: response.data.userName,
          gender: response.data.gender,
          email: response.data.email,
          role: response.data.role,
          status: response.data.status,
          dob: response.data.dob ? moment(response.data.dob) : null,
          nationalID: response.data.nationalID,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải thông tin nhân viên",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi tải thông tin nhân viên",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (userId) {
      fetchEmployeeData();
    }
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const updatedEmployee = {
        userName: values.userName,
        gender: values.gender,
        email: values.email,
        role: values.role,
        status: values.status,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        nationalID: values.nationalID,
      };

      const response = await employeeService.updateEmployee(
        userId,
        updatedEmployee
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description:
            response.message || "Cập nhật thông tin nhân viên thành công",
          placement: "bottomRight",
        });
        setIsEditing(false);
        fetchEmployeeData();
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể cập nhật thông tin nhân viên",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật thông tin nhân viên",
        placement: "bottomRight",
      });
    }
  };

  // Handle delete employee
  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận xóa nhân viên",
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc chắn muốn xóa nhân viên ${employee?.userName}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await employeeService.deleteEmployee(userId);

          if (response.success) {
            notification.success({
              message: "Thành công",
              description: response.message || "Xóa nhân viên thành công",
              placement: "bottomRight",
            });
            navigate("/manager/employees");
          } else {
            notification.error({
              message: "Lỗi",
              description: response.message || "Không thể xóa nhân viên",
              placement: "bottomRight",
            });
          }
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Đã xảy ra lỗi khi xóa nhân viên",
            placement: "bottomRight",
          });
        }
      },
    });
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Map role to display text
  const getRoleDisplayText = (role) => {
    switch (role) {
      case "MANAGER":
        return "Quản lý";
      case "LIBRARIAN":
        return "Thủ thư";
      case "COORDINATOR":
        return "Nhân viên phòng đọc";
      default:
        return role;
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const getStatusTag = (status) => {
    if (status === "Hoạt động") {
      return <Tag color="success">{status}</Tag>;
    } else {
      return <Tag color="error">{status}</Tag>;
    }
  };

  if (loading) {
    return (
      <Card className={styles.employeeCard}>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className={styles.employeeCard}>
        <div className={styles.notFound}>
          <Text type="secondary">Không tìm thấy thông tin nhân viên</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={styles.employeeCard}
      variant="borderless"
      title={
        <div className={styles.cardTitle}>
          <span style={{ marginLeft: 15, fontSize: 20 }}>
            Thông tin chi tiết nhân viên
          </span>
        </div>
      }
      extra={
        !isEditing ? (
          <Space style={{ marginRight: 15 }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
            >
              Xóa
            </Button>
          </Space>
        ) : (
          <Space style={{ marginRight: 15 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
            >
              Lưu
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
              Hủy
            </Button>
          </Space>
        )
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className={styles.profileSection}>
            <div className={styles.avatarContainer}>
              <Avatar
                size={150}
                src={employee.userImage}
                icon={<UserOutlined />}
                className={styles.avatar}
              />
              <div className={styles.employeeName}>
                <Title level={4}>{employee.userName}</Title>
                {!isEditing && getStatusTag(employee.status)}
              </div>
              <div className={styles.employeeId}>
                <IdcardOutlined /> ID: {employee.userID}
              </div>
              <div className={styles.employeeRole}>
                <TeamOutlined /> {getRoleDisplayText(employee.role)}
              </div>
            </div>

            {!isEditing && (
              <div className={styles.quickInfoSection}>
                <div className={styles.quickInfoItem}>
                  <MailOutlined className={styles.infoIcon} />
                  <Text>{employee.email}</Text>
                </div>
                <div className={styles.quickInfoItem}>
                  <CalendarOutlined className={styles.infoIcon} />
                  <Text>Ngày sinh: {formatDate(employee.dob)}</Text>
                </div>
                <div className={styles.quickInfoItem}>
                  <IdcardOutlined className={styles.infoIcon} />
                  <Text>CCCD/CMND: {employee.nationalID}</Text>
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} md={16}>
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className={styles.editForm}
              initialValues={{
                userName: employee.userName,
                gender: employee.gender,
                email: employee.email,
                role: employee.role,
                status: employee.status,
                dob: employee.dob ? moment(employee.dob) : null,
                nationalID: employee.nationalID,
              }}
            >
              <Row gutter={16}>
                <Col span={24} md={12}>
                  <Form.Item
                    name="userName"
                    label="Họ tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Select>
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                      <Option value="Khác">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="role"
                    label="Vai trò"
                    rules={[
                      { required: true, message: "Vui lòng chọn vai trò" },
                    ]}
                  >
                    <Select>
                      <Option value="MANAGER">Quản lý</Option>
                      <Option value="LIBRARIAN">Thủ thư</Option>
                      <Option value="COORDINATOR">Nhân viên phòng đọc</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái" },
                    ]}
                  >
                    <Select>
                      <Option value="Hoạt động">Hoạt động</Option>
                      <Option value="Vô hiệu hóa">Vô hiệu hóa</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="dob"
                    label="Ngày sinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    name="nationalID"
                    label="CCCD/CMND"
                    rules={[
                      { required: true, message: "Vui lòng nhập CCCD/CMND" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <div className={styles.detailInfoSection}>
              <Divider orientation="left">Thông tin chi tiết</Divider>

              <Row gutter={[16, 16]}>
                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Họ tên:</div>
                    <div className={styles.infoValue}>{employee.userName}</div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Giới tính:</div>
                    <div className={styles.infoValue}>{employee.gender}</div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Email:</div>
                    <div className={styles.infoValue}>{employee.email}</div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Vai trò:</div>
                    <div className={styles.infoValue}>
                      {getRoleDisplayText(employee.role)}
                    </div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Trạng thái:</div>
                    <div className={styles.infoValue}>
                      {getStatusTag(employee.status)}
                    </div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Ngày sinh:</div>
                    <div className={styles.infoValue}>
                      {formatDate(employee.dob)}
                    </div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>CCCD/CMND:</div>
                    <div className={styles.infoValue}>
                      {employee.nationalID}
                    </div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Ngày tạo tài khoản:</div>
                    <div className={styles.infoValue}>
                      {formatDate(employee.createAt)}
                    </div>
                  </div>
                </Col>

                <Col span={24} md={12}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Đăng nhập gần nhất:</div>
                    <div className={styles.infoValue}>
                      {employee.lastLoginAt
                        ? moment(employee.lastLoginAt).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : "N/A"}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default EmployeeDetail;
