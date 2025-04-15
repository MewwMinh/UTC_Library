// src/components/reading-room/CheckInPatron.jsx
import { useState } from "react";
import { Input, Button, notification, Card, Form, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import readingRoomService from "/src/services/coordinator/readingRoomService.js";
import styles from "/src/styles/ReadingRoom.module.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const CheckInPatron = ({ onCheckInSuccess }) => {
  const [patronID, setPatronID] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCheckIn = async () => {
    if (!patronID.trim()) {
      notification.warning({
        message: "Vui lòng nhập mã bạn đọc",
        placement: "bottomRight",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await readingRoomService.checkInPatron(patronID.trim());

      if (response.success) {
        notification.success({
          message: "Check-in thành công",
          description: response.message,
          placement: "bottomRight",
        });
        setPatronID("");
        form.resetFields();
        if (onCheckInSuccess) {
          onCheckInSuccess();
        }
      } else {
        notification.error({
          message: "Check-in thất bại",
          description: response.message,
          placement: "bottomRight",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể thực hiện check-in. Vui lòng thử lại sau.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.checkInCard} variant="borderless">
      <Title level={4} className={styles.cardTitle}>
        <UserAddOutlined /> Check-in bạn đọc
      </Title>
      <Form form={form} layout="inline" className={styles.checkInForm}>
        <Form.Item
          name="patronID"
          className={styles.formInput}
          rules={[{ required: true, message: "Vui lòng nhập mã bạn đọc!" }]}
        >
          <Input
            placeholder="Nhập mã bạn đọc"
            value={patronID}
            onChange={(e) => setPatronID(e.target.value)}
            onPressEnter={handleCheckIn}
            className={styles.patronIdInput}
          />
        </Form.Item>
        <Form.Item className={styles.formButton}>
          <Button
            type="primary"
            onClick={handleCheckIn}
            loading={loading}
            className={styles.checkInButton}
          >
            Check-in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

CheckInPatron.propTypes = {
  onCheckInSuccess: PropTypes.func,
};

export default CheckInPatron;
