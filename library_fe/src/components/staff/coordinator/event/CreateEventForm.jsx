import { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  message,
  Card,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/eventStaff/CreateEventForm.module.css";
import eventService from "/src/services/coordinator/eventService.js";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateEventForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Extract the date range
      const [startTime, endTime] = values.eventTimeRange;

      // Create the payload
      const eventData = {
        title: values.title,
        description: values.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: values.location,
        maxAttendees: values.maxAttendees, // Ensure this is sent as a number
      };

      const response = await eventService.createEvent(eventData);

      if (response.success) {
        message.success(response.message);
        form.resetFields();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Create event error:", error);
      message.error("Lỗi khi tạo sự kiện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
      navigate("/staff/events");
    }
  };

  return (
    <Card className={styles.formContainer}>
      <h2 className={styles.formTitle}>Tạo Sự Kiện Mới</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label={<span className={styles.required}>Tiêu đề sự kiện</span>}
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề sự kiện" }]}
        >
          <Input
            prefix={<CalendarOutlined />}
            placeholder="Nhập tiêu đề sự kiện"
            className={styles.formInput}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className={styles.required}>Mô tả</span>}
          rules={[{ required: true, message: "Vui lòng nhập mô tả sự kiện" }]}
        >
          <TextArea
            placeholder="Nhập mô tả chi tiết về sự kiện"
            autoSize={{ minRows: 4, maxRows: 8 }}
            className={styles.formTextarea}
          />
        </Form.Item>

        <div className={styles.dateTimeGroup}>
          <Form.Item
            name="eventTimeRange"
            label={<span className={styles.required}>Thời gian sự kiện</span>}
            className={styles.formGroup}
            rules={[
              { required: true, message: "Vui lòng chọn thời gian sự kiện" },
              // eslint-disable-next-line no-unused-vars
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value[0].isBefore(value[1])) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Thời gian kết thúc phải sau thời gian bắt đầu")
                  );
                },
              }),
            ]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
              className={styles.datePicker}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label={<span className={styles.required}>Địa điểm</span>}
            className={styles.formGroup}
            rules={[
              { required: true, message: "Vui lòng nhập địa điểm sự kiện" },
            ]}
          >
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Nhập địa điểm sự kiện"
              className={styles.formInput}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="maxAttendees"
          label="Số lượng người tham gia tối đa"
          rules={[
            {
              type: "number",
              min: 1,
              message: "Số lượng người tham gia phải lớn hơn 0",
            },
          ]}
        >
          <InputNumber
            prefix={<TeamOutlined />}
            placeholder="Nhập số lượng người tham gia tối đa"
            className={styles.formInput}
            min={1}
            parser={(value) => (value ? parseInt(value, 10) : null)}
          />
        </Form.Item>

        <div className={styles.buttonContainer}>
          <Button
            onClick={() => form.resetFields()}
            disabled={loading}
            className={styles.cancelButton}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
          >
            Tạo Sự Kiện
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreateEventForm;
