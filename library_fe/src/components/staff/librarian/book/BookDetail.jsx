import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Typography,
  Row,
  Col,
  Divider,
  Space,
  message,
  Modal,
  Descriptions,
  Badge,
  Upload,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BookDetailAdmin = () => {
  const [form] = Form.useForm();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Thông tin chi tiết sách (giả lập dữ liệu từ API)
  const initialBookData = {
    id: "B12345",
    isbn: "978-604-316-789-5",
    title: "Thiết kế và quản lý giao thông",
    author: "Nguyễn Văn A",
    language: "Tiếng Việt",
    classification: "GTV-001",
    publishYear: 2022,
    publisher: "NXB Giao thông vận tải",
    pages: 350,
    size: "17x24 cm",
    category: "Giao thông",
    description:
      "Sách tổng hợp các kiến thức quan trọng về thiết kế và quản lý hệ thống giao thông đô thị. Phân tích các mô hình, phương pháp và giải pháp tiên tiến trong lĩnh vực giao thông.",
    availableCopies: 5,
    totalCopies: 8,
    coverImage: "https://via.placeholder.com/300x400",
    location: "Kệ A5, Tầng 2",
    importDate: "2023-05-15",
    status: "active", // active, inactive
  };

  // Khởi tạo form với dữ liệu ban đầu
  useState(() => {
    form.setFieldsValue(initialBookData);
  }, []);

  // Xử lý sự kiện khi form thay đổi
  const handleFormChange = () => {
    setIsFormChanged(true);
  };

  // Xử lý lưu thông tin sách
  const handleSaveBook = async () => {
    try {
      const values = await form.validateFields();
      console.log("Thông tin sách đã cập nhật:", values);

      // Giả lập gọi API lưu dữ liệu
      setTimeout(() => {
        message.success("Đã lưu thông tin sách thành công!");
        setIsFormChanged(false);
      }, 500);
    } catch (errorInfo) {
      console.log("Lỗi xác thực:", errorInfo);
    }
  };

  // Xử lý xóa sách
  const handleDeleteBook = () => {
    // Giả lập gọi API xóa sách
    setTimeout(() => {
      message.success("Đã xóa sách thành công!");
      setIsDeleting(false);
      // Trong thực tế, sẽ chuyển về trang danh sách sách
    }, 500);
  };

  // Xử lý quay lại trang danh sách
  const handleGoBack = () => {
    console.log("Quay lại trang danh sách sách");
    // Trong thực tế sẽ điều hướng về trang danh sách sách
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết sách
            </Title>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveBook}
              disabled={!isFormChanged}
            >
              Lưu thay đổi
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleting(true)}
            >
              Xóa sách
            </Button>
          </Space>
        </div>

        <Divider />

        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Row gutter={24}>
            <Col span={8}>
              <Card title="Hình ảnh sách" style={{ marginBottom: 16 }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <img
                    src={initialBookData.coverImage}
                    alt={initialBookData.title}
                    style={{ maxWidth: "100%", maxHeight: 300 }}
                  />
                </div>
                <Form.Item name="coverImage" label="URL hình ảnh">
                  <Input placeholder="Nhập đường dẫn hình ảnh" />
                </Form.Item>
                <Upload>
                  <Button icon={<UploadOutlined />}>
                    Tải lên hình ảnh mới
                  </Button>
                </Upload>
              </Card>

              <Card title="Thông tin tình trạng">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã sách">
                    {initialBookData.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày nhập">
                    {initialBookData.importDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={
                        initialBookData.status === "active"
                          ? "success"
                          : "error"
                      }
                      text={
                        initialBookData.status === "active"
                          ? "Đang hoạt động"
                          : "Không hoạt động"
                      }
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={16}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="title"
                    label="Tên sách"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên sách!" },
                    ]}
                  >
                    <Input placeholder="Nhập tên sách" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="author"
                    label="Tác giả"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên tác giả!" },
                    ]}
                  >
                    <Input placeholder="Nhập tên tác giả" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="isbn"
                    label="ISBN"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã ISBN!" },
                    ]}
                  >
                    <Input placeholder="Nhập mã ISBN" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="publisher" label="Nhà xuất bản">
                    <Input placeholder="Nhập tên nhà xuất bản" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="publishYear" label="Năm xuất bản">
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1900}
                      max={2100}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="language" label="Ngôn ngữ">
                    <Input placeholder="Nhập ngôn ngữ" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="category" label="Loại sách">
                    <Input placeholder="Nhập loại sách" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="classification" label="Chỉ số phân loại">
                    <Input placeholder="Nhập chỉ số phân loại" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="pages" label="Số trang">
                    <InputNumber style={{ width: "100%" }} min={1} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="size" label="Khổ cỡ">
                    <Input placeholder="Nhập khổ cỡ sách" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="location" label="Vị trí">
                    <Input placeholder="Nhập vị trí sách" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="availableCopies" label="Số bản có sẵn">
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="totalCopies" label="Tổng số bản">
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select>
                      <Option value="active">Đang hoạt động</Option>
                      <Option value="inactive">Không hoạt động</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="description" label="Mô tả">
                    <TextArea rows={4} placeholder="Nhập mô tả sách" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Modal xác nhận xóa sách */}
      <Modal
        title="Xác nhận xóa sách"
        open={isDeleting}
        onOk={handleDeleteBook}
        onCancel={() => setIsDeleting(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa sách "{initialBookData.title}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default BookDetailAdmin;
