import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  message,
  Card,
  Typography,
  Divider,
  Space,
  Row,
  Col,
} from "antd";
import {
  BookOutlined,
  UploadOutlined,
  SaveOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddBookComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Các ngôn ngữ sách thông dụng
  const languages = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "Tiếng Anh" },
    { value: "fr", label: "Tiếng Pháp" },
    { value: "de", label: "Tiếng Đức" },
    { value: "ja", label: "Tiếng Nhật" },
    { value: "zh", label: "Tiếng Trung" },
    { value: "ko", label: "Tiếng Hàn" },
    { value: "ru", label: "Tiếng Nga" },
  ];

  // Các loại sách thông dụng
  const bookCategories = [
    { value: "textbook", label: "Giáo trình" },
    { value: "reference", label: "Tài liệu tham khảo" },
    { value: "scientific", label: "Khoa học kỹ thuật" },
    { value: "engineering", label: "Kỹ thuật" },
    { value: "transportation", label: "Giao thông vận tải" },
    { value: "economics", label: "Kinh tế" },
    { value: "literature", label: "Văn học" },
    { value: "history", label: "Lịch sử" },
    { value: "foreign_language", label: "Ngoại ngữ" },
    { value: "research", label: "Nghiên cứu khoa học" },
  ];

  // Các khổ cỡ sách thông dụng
  const bookSizes = [
    { value: "A4", label: "A4 (210 × 297mm)" },
    { value: "A5", label: "A5 (148 × 210mm)" },
    { value: "B5", label: "B5 (176 × 250mm)" },
    { value: "16x24", label: "16 × 24cm" },
    { value: "14.5x20.5", label: "14.5 × 20.5cm" },
    { value: "custom", label: "Khác (ghi chú trong mô tả)" },
  ];

  // Xử lý upload hình ảnh
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Xử lý upload
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Hàm gửi form
  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu gửi lên server
      const formData = new FormData();

      // Thêm các trường thông tin sách
      Object.keys(values).forEach((key) => {
        if (key === "publishYear") {
          // Chuyển đổi từ đối tượng Dayjs sang năm
          formData.append(key, values[key].year());
        } else if (key === "bookCover" && values[key]) {
          // Xử lý file riêng
        } else {
          formData.append(key, values[key]);
        }
      });

      // Thêm file ảnh bìa sách nếu có
      if (fileList.length > 0) {
        formData.append("bookCover", fileList[0].originFileObj);
      }

      // Gọi API thêm sách
      const response = await axios.post("/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        message.success("Thêm sách mới thành công!");
        form.resetFields();
        setFileList([]);
      } else {
        message.error("Thêm sách thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      message.error("Đã xảy ra lỗi khi thêm sách. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    message.info("Đã xóa tất cả thông tin nhập!");
  };

  return (
    <Card className="add-book-card">
      <Title level={2} style={{ textAlign: "center" }}>
        <BookOutlined /> Thêm Sách Mới
      </Title>
      <Divider />

      <Form
        form={form}
        name="addBookForm"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          totalCopies: 1,
          status: "available",
          language: "vi",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="ISBN"
              name="isbn"
              rules={[
                { required: true, message: "Vui lòng nhập mã ISBN!" },
                {
                  pattern: /^(?:\d{10}|\d{13})$/,
                  message: "ISBN phải có 10 hoặc 13 chữ số!",
                },
              ]}
            >
              <Input placeholder="VD: 9786045652985" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Mã sách"
              name="bookCode"
              rules={[{ required: true, message: "Vui lòng nhập mã sách!" }]}
            >
              <Input placeholder="VD: CS001" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tên sách"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
        >
          <Input placeholder="Nhập tên đầy đủ của sách" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tác giả"
              name="author"
              rules={[
                { required: true, message: "Vui lòng nhập tên tác giả!" },
              ]}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Loại sách"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn loại sách!" }]}
            >
              <Select placeholder="Chọn loại sách">
                {bookCategories.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Ngôn ngữ"
              name="language"
              rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
            >
              <Select placeholder="Chọn ngôn ngữ">
                {languages.map((lang) => (
                  <Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Năm xuất bản"
              name="publishYear"
              rules={[
                { required: true, message: "Vui lòng chọn năm xuất bản!" },
              ]}
            >
              <DatePicker picker="year" placeholder="Chọn năm" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Nhà xuất bản"
              name="publisher"
              rules={[
                { required: true, message: "Vui lòng nhập nhà xuất bản!" },
              ]}
            >
              <Input placeholder="VD: NXB Đại học GTVT" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Số trang"
              name="pageCount"
              rules={[{ required: true, message: "Vui lòng nhập số trang!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="VD: 350"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Khổ cỡ"
              name="size"
              rules={[
                { required: true, message: "Vui lòng chọn khổ cỡ sách!" },
              ]}
            >
              <Select placeholder="Chọn khổ cỡ sách">
                {bookSizes.map((size) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Số lượng bản sao"
              name="totalCopies"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="VD: 10"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết về sách" />
        </Form.Item>

        <Form.Item
          name="bookCover"
          label="Ảnh bìa sách"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Tải lên ảnh bìa</Button>
            <Text type="secondary" style={{ marginLeft: 10 }}>
              Hỗ trợ: JPG, PNG, JPEG (tối đa 2MB)
            </Text>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Chỉ số phân loại"
          name="classificationNumber"
          tooltip="Mã phân loại theo hệ thống DDC hoặc LCC"
        >
          <Input placeholder="VD: 005.133" />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button
              type="default"
              onClick={handleReset}
              icon={<ClearOutlined />}
            >
              Xóa dữ liệu
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Thêm sách
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddBookComponent;
