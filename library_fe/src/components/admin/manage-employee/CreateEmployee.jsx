import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Card,
  message,
  Row,
  Col,
  Space,
  Divider,
  Avatar,
  Typography,
  Spin,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import employeeService from "/src/services/manager/employeeService.js";
import styles from "/src/styles/manager/manage-employee/CreateEmployee.module.css";
import moment from "moment";

const { Option } = Select;

const CreateEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [serverImageUrl, setServerImageUrl] = useState("");
  const [userId, setUserId] = useState("");

  // Khởi tạo userId khi component mount
  useEffect(() => {
    const newId = employeeService.generateEmployeeId();
    setUserId(newId);
    form.setFieldsValue({ userID: newId });
  }, [form]);

  // Xử lý tạo nhân viên mới
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu
      const employeeData = {
        userID: userId,
        userName: values.userName,
        userImage: serverImageUrl || null, // Sử dụng URL đã upload
        gender: values.gender,
        email: values.email,
        role: values.role,
        createAt: moment().format("YYYY-MM-DD"),
        dob: values.dob.format("YYYY-MM-DD"),
        nationalID: values.nationalID,
      };

      // Gọi API tạo nhân viên
      const response = await employeeService.createEmployee(employeeData);

      if (response.success) {
        message.success("Tạo nhân viên thành công!");
        navigate("/manager/employees");
      } else {
        message.error(response.message || "Tạo nhân viên thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      message.error("Đã xảy ra lỗi khi tạo nhân viên. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  // Chuyển file thành base64 để xem trước
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Tạo mới mã nhân viên
  const regenerateEmployeeId = () => {
    const newId = employeeService.generateEmployeeId();
    setUserId(newId);
    form.setFieldsValue({ userID: newId });
  };

  // Các tùy chọn cho upload ảnh
  // Upload avatar props
  const uploadProps = {
    name: "file",
    accept: "image/*",
    showUploadList: false,
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Bạn chỉ có thể tải lên file ảnh!");
        return Upload.LIST_IGNORE;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return Upload.LIST_IGNORE;
      }

      setAvatarLoading(true);

      try {
        // Hiển thị preview
        const base64Image = await getBase64(file);
        setAvatarUrl(base64Image);

        // Kiểm tra userId
        if (!userId) {
          message.error("Không thể upload ảnh - Mã nhân viên không hợp lệ!");
          return Upload.LIST_IGNORE;
        }

        // Upload ảnh
        const response = await employeeService.uploadEmployeeAvatar(
          userId,
          file
        );

        if (response?.success) {
          setServerImageUrl(response.imageUrl);
          message.success("Tải ảnh thành công!");
        } else {
          message.error(response?.message || "Tải ảnh thất bại!");
        }
      } catch (error) {
        message.error("Lỗi khi tải ảnh đại diện!");
        console.error("Upload error:", error);
      } finally {
        setAvatarLoading(false);
      }

      return Upload.LIST_IGNORE; // ngăn antd tự xử lý
    },
  };

  return (
    <div className={styles.container}>
      <Card
        className={styles.card}
        title={
          <span style={{ marginLeft: 15, fontSize: 20 }}>
            Tạo nhân viên mới
          </span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: "Nam",
            role: "LIBRARIAN",
            dob: moment().subtract(20, "years"),
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={8} className={styles.avatarSection}>
              <div className={styles.avatarUpload}>
                <Avatar
                  size={150}
                  icon={<UserOutlined />}
                  src={avatarUrl}
                  className={styles.avatar}
                />
                <div className={styles.uploadButton}>
                  <Upload {...uploadProps}>
                    <Button
                      icon={
                        avatarLoading ? <LoadingOutlined /> : <UploadOutlined />
                      }
                      disabled={avatarLoading}
                      type="primary"
                    >
                      {avatarLoading ? "Đang tải lên..." : "Tải ảnh đại diện"}
                    </Button>
                  </Upload>

                  {serverImageUrl ? (
                    <Typography.Text type="success">
                      Đã tải lên thành công
                    </Typography.Text>
                  ) : avatarUrl ? (
                    <Typography.Text type="warning">
                      <Spin size="small" style={{ marginRight: 8 }} /> Đang xử
                      lý...
                    </Typography.Text>
                  ) : null}
                </div>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mã nhân viên"
                    name="userID"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã nhân viên!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      disabled
                      addonAfter={
                        <Button
                          type="link"
                          icon={<ReloadOutlined />}
                          onClick={regenerateEmployeeId}
                          size="small"
                          style={{ margin: -7 }}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ và tên!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập email!",
                      },
                      {
                        type: "email",
                        message: "Email không hợp lệ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số CCCD/CMND"
                    name="nationalID"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số CCCD/CMND!",
                      },
                      {
                        pattern: /^\d{9,12}$/,
                        message: "Số CCCD/CMND không hợp lệ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày sinh!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      disabledDate={(current) => {
                        // Không cho phép chọn ngày trong tương lai
                        // Và không cho phép chọn người dưới 18 tuổi
                        return (
                          current &&
                          (current > moment().endOf("day") ||
                            current >
                              moment().subtract(18, "years").endOf("day"))
                        );
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn giới tính!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Vai trò"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn vai trò!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="LIBRARIAN">Thủ thư</Option>
                      <Option value="COORDINATOR">Điều phối viên</Option>
                      <Option value="MANAGER">Quản lý</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />

          <div className={styles.formActions}>
            <Space>
              <Button onClick={() => navigate("/manager/employees")}>
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Tạo nhân viên
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateEmployee;
