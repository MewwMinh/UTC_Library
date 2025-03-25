import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  Row,
  Col,
  Typography,
  notification,
  Space,
  Divider,
  Upload,
  message,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import bookService from "/src/services/librarian/bookService.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Danh sách mã phân loại DDC
const ddcClassifications = [
  { code: "000", name: "Tổng quát" },
  { code: "100", name: "Triết học & Tâm lý học" },
  { code: "200", name: "Tôn giáo" },
  { code: "300", name: "Khoa học xã hội" },
  { code: "400", name: "Ngôn ngữ học" },
  { code: "500", name: "Khoa học tự nhiên & Toán học" },
  { code: "600", name: "Công nghệ & Khoa học ứng dụng" },
  { code: "700", name: "Nghệ thuật & Giải trí" },
  { code: "800", name: "Văn học" },
  { code: "900", name: "Lịch sử & Địa lý" },
];

const BookAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  // const [coverImage, setCoverImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [cloudImageUrl, setCloudImageUrl] = useState("");
  const [isbnEntered, setIsbnEntered] = useState(false);

  const yearNow = new Date().getFullYear();

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Prepare form data with coverImage URL from cloud (not the base64)
      const bookData = {
        ...values,
        coverImage: cloudImageUrl, // URL từ cloud đã được lưu từ API phản hồi khi tải ảnh
      };
      console.log("CloudImgURL: " + cloudImageUrl);

      const response = await bookService.addBook(bookData);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: "Thêm sách mới thành công",
        });
        navigate("/staff/books");
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể thêm sách mới",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
      console.error("Error adding book:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Chuyển đổi file thành base64 để hiển thị ngay
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = async (file) => {
    // Kiểm tra xem ISBN đã được nhập chưa
    const isbn = form.getFieldValue("isbn");
    if (!isbn) {
      message.error("Vui lòng nhập mã ISBN trước khi tải ảnh bìa sách!");
      return false;
    }

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận định dạng ảnh JPG/PNG!");
      return false;
    }

    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    try {
      setUploadingImage(true);

      // Chuyển đổi file thành base64 để hiển thị ngay
      const base64Image = await fileToBase64(file);
      // Hiển thị ảnh dưới dạng base64 ngay lập tức
      setImageUrl(base64Image);

      // Tải ảnh lên server sử dụng API
      const response = await bookService.uploadBookCover(isbn, file);
      console.log(response);

      if (response.success) {
        setCloudImageUrl(response.result);
        message.success(response.message || "Tải ảnh bìa thành công!");
      } else {
        // Nếu tải lên thất bại, xóa ảnh đã hiển thị
        setImageUrl("");
        message.error(response.message || "Không thể tải ảnh bìa lên server!");
      }
    } catch (error) {
      // Nếu có lỗi, xóa ảnh đã hiển thị
      setImageUrl("");
      message.error("Lỗi khi tải ảnh lên server!");
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }

    return false; // Prevent auto-upload
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setCloudImageUrl("");
  };

  return (
    <Card
      title={
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Thêm sách mới</Title>
        </div>
      }
      extra={
        <Button
          icon={<RollbackOutlined />}
          onClick={() => navigate("/staff/books")}
        >
          Quay lại
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          language: "Tiếng Việt",
          bookType: "Giáo trình",
          publicationYear: yearNow,
          format: "16 cm x 24 cm",
          totalCopies: 1,
        }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={24} md={16} lg={18}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="isbn"
                  label="Mã ISBN"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã ISBN" },
                    {
                      pattern: /^[0-9-]+$/,
                      message: "ISBN chỉ gồm số và dấu gạch ngang",
                    },
                  ]}
                >
                  <Input
                    placeholder="VD: 978-3-16-148410-0"
                    onChange={(e) => {
                      // Cập nhật trạng thái isbnEntered dựa trên giá trị nhập vào
                      const value = e.target.value;
                      setIsbnEntered(value && value.trim().length > 0);

                      // Reset image when ISBN changes
                      if (imageUrl) {
                        setImageUrl("");
                        setCloudImageUrl("");
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bookType"
                  label="Loại sách"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại sách" },
                  ]}
                >
                  <Select placeholder="Chọn loại sách">
                    <Option value="Giáo trình">Giáo trình</Option>
                    <Option value="Tài liệu tham khảo">
                      Tài liệu tham khảo
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="bookName"
              label="Tên sách"
              rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
            >
              <Input placeholder="VD: Giáo trình Mạng máy tính" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Tác giả"
              rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
            >
              <Input placeholder="VD: Nguyễn Văn A" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="publicationYear"
                  label="Năm xuất bản"
                  rules={[
                    { required: true, message: "Vui lòng nhập năm xuất bản" },
                  ]}
                >
                  <InputNumber
                    min={1900}
                    max={yearNow}
                    style={{ width: "100%" }}
                    placeholder={yearNow.toString()}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="language"
                  label="Ngôn ngữ"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngôn ngữ" },
                  ]}
                >
                  <Select placeholder="Chọn ngôn ngữ">
                    <Option value="Tiếng Việt">Tiếng Việt</Option>
                    <Option value="Tiếng Anh">Tiếng Anh</Option>
                    <Option value="Tiếng Pháp">Tiếng Pháp</Option>
                    <Option value="Tiếng Trung">Tiếng Trung</Option>
                    <Option value="Tiếng Nhật">Tiếng Nhật</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="totalCopies"
                  label="Tổng số bản"
                  rules={[
                    { required: true, message: "Vui lòng nhập tổng số bản" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="VD: 10"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="pageCount" label="Số trang">
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="VD: 350"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="format" label="Khổ sách">
                  <Select placeholder="Chọn khổ sách">
                    <Option value="14,5 cm x 20,5 cm">14,5 cm x 20,5 cm</Option>
                    <Option value="16 cm x 24 cm">16 cm x 24 cm</Option>
                    <Option value="19 cm × 27 cm">19 cm × 27 cm</Option>
                    <Option value="13 cm × 19 cm">13 cm × 19 cm</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="ddcCode" label="Mã phân loại DDC">
                  <Select
                    placeholder="Chọn mã phân loại"
                    showSearch
                    optionFilterProp="children"
                  >
                    {ddcClassifications.map((ddc) => (
                      <Option key={ddc.code} value={ddc.code}>
                        {ddc.code} - {ddc.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả">
              <TextArea rows={6} placeholder="Nhập mô tả sách..." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={6}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  <Text strong>Ảnh bìa sách</Text>
                </div>
              }
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {imageUrl ? (
                  <div
                    style={{ display: "inline-block", position: "relative" }}
                  >
                    <img
                      src={imageUrl}
                      alt="Ảnh bìa sách"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                      }}
                    />
                    <Button
                      type="link"
                      danger
                      icon={<PlusOutlined rotate={45} />}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleRemoveImage}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #d9d9d9",
                      borderRadius: 4,
                    }}
                  >
                    <Text type="secondary">Chưa có ảnh bìa</Text>
                  </div>
                )}
              </div>

              <Tooltip
                title={!isbnEntered ? "Nhập mã ISBN trước khi tải ảnh bìa" : ""}
              >
                <Upload
                  name="coverImage"
                  listType="picture"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  accept="image/png, image/jpeg"
                  disabled={!isbnEntered}
                >
                  <Button
                    icon={<UploadOutlined />}
                    block
                    loading={uploadingImage}
                    disabled={!isbnEntered}
                  >
                    Chọn ảnh bìa
                  </Button>
                </Upload>
              </Tooltip>
              <Text
                type="secondary"
                style={{ display: "block", marginTop: 8, fontSize: 12 }}
              >
                Chỉ chấp nhận ảnh JPG/PNG, dung lượng &lt; 2MB
              </Text>
            </Card>

            <div style={{ marginTop: 24 }}>
              <Text type="secondary">
                <strong>Lưu ý:</strong> Các thông tin về tác giả, năm xuất bản
                và mã ISBN phải chính xác để đảm bảo việc quản lý sách được hiệu
                quả.
              </Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              Thêm sách
            </Button>
            <Button
              danger
              onClick={() => navigate("/staff/books")}
              size="large"
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BookAdd;
