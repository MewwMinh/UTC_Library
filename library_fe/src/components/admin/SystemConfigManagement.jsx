import { Card, InputNumber, TimePicker, Button, Form, message } from "antd";
import moment from "moment";

const SystemConfigManagement = () => {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log("Saved Config:", values);
    message.success("Cấu hình đã được lưu thành công!");
  };

  return (
    <Card title="Quản lý Cấu hình Hệ thống" style={{ width: "100%" }}>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        {/* Cấu hình chính sách mượn/trả sách */}
        <Form.Item
          label="Thời gian mượn tối đa (ngày)"
          name="maxBorrowDays"
          initialValue={14}
        >
          <InputNumber min={1} max={60} />
        </Form.Item>
        <Form.Item
          label="Số lượng sách mượn tối đa"
          name="maxBooks"
          initialValue={5}
        >
          <InputNumber min={1} max={20} />
        </Form.Item>

        {/* Cấu hình thời gian hoạt động */}
        <Form.Item
          label="Giờ mở cửa"
          name="openTime"
          initialValue={moment("08:00", "HH:mm")}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="Giờ đóng cửa"
          name="closeTime"
          initialValue={moment("18:00", "HH:mm")}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        {/* Quản lý mức phạt */}
        <Form.Item
          label="Phạt trả sách trễ (VNĐ/ngày)"
          name="lateFee"
          initialValue={5000}
        >
          <InputNumber min={0} step={1000} />
        </Form.Item>
        <Form.Item
          label="Phạt làm mất sách (VNĐ)"
          name="lostBookFee"
          initialValue={100000}
        >
          <InputNumber min={0} step={10000} />
        </Form.Item>

        {/* Sao lưu & khôi phục dữ liệu */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu Cấu Hình
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            danger
            onClick={() => message.info("Đang thực hiện sao lưu...")}
          >
            Sao lưu
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() =>
              message.warning("Khôi phục dữ liệu chưa được hỗ trợ!")
            }
          >
            Khôi phục
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SystemConfigManagement;
