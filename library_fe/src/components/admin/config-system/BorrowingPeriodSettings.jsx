// src/components/LibrarySettings/BorrowingPeriodSettings.jsx
import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  notification,
  Tooltip,
  Divider,
  Tag,
} from "antd";
import {
  EditOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/manager/config-system/SettingSection.module.css";
import librarySettingsService from "/src/services/manager/librarySettingsService.js";

const BorrowingPeriodSettings = ({ settings, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    form.setFieldsValue(settings);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response =
        await librarySettingsService.updateBorrowingPeriodSettings(values);

      if (response.success) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cài đặt thời gian mượn sách đã được cập nhật",
        });
        setIsModalVisible(false);
        onUpdate({ ...settings, ...values });
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: response.message || "Đã xảy ra lỗi khi cập nhật cài đặt",
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const tooltips = {
    maximumBorrowingPeriodForReferenceMaterials:
      "Thời gian tối đa mượn tài liệu tham khảo (ngày)",
    semester1_BorrowStartDate: "Ngày bắt đầu mượn sách học kỳ 1",
    semester1_BorrowEndDate: "Ngày kết thúc mượn sách học kỳ 1",
    semester1_LatestReturnDate: "Ngày trả sách muộn nhất học kỳ 1",
    semester2_BorrowStartDate: "Ngày bắt đầu mượn sách học kỳ 2",
    semester2_BorrowEndDate: "Ngày kết thúc mượn sách học kỳ 2",
    semester2_LatestReturnDate: "Ngày trả sách muộn nhất học kỳ 2",
  };

  // Group the settings by semester
  const semester1Settings = [
    {
      key: "semester1_BorrowStartDate",
      value: settings.semester1_BorrowStartDate,
      label: "Ngày bắt đầu mượn sách",
    },
    {
      key: "semester1_BorrowEndDate",
      value: settings.semester1_BorrowEndDate,
      label: "Ngày kết thúc mượn sách",
    },
    {
      key: "semester1_LatestReturnDate",
      value: settings.semester1_LatestReturnDate,
      label: "Ngày trả sách muộn nhất",
    },
  ];

  const semester2Settings = [
    {
      key: "semester2_BorrowStartDate",
      value: settings.semester2_BorrowStartDate,
      label: "Ngày bắt đầu mượn sách",
    },
    {
      key: "semester2_BorrowEndDate",
      value: settings.semester2_BorrowEndDate,
      label: "Ngày kết thúc mượn sách",
    },
    {
      key: "semester2_LatestReturnDate",
      value: settings.semester2_LatestReturnDate,
      label: "Ngày trả sách muộn nhất",
    },
  ];

  return (
    <div className={styles.settingSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cài đặt thời gian mượn sách</h3>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showModal}
          className={styles.editButton}
        >
          Thay đổi
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            Thời gian tối đa mượn tài liệu tham khảo
            <Tooltip
              title={tooltips.maximumBorrowingPeriodForReferenceMaterials}
            >
              <InfoCircleOutlined style={{ color: "#1677ff", marginLeft: 8 }} />
            </Tooltip>
          </div>
          <div className={styles.settingValue}>
            {settings.maximumBorrowingPeriodForReferenceMaterials} ngày
          </div>
        </div>

        <Divider style={{ margin: "12px 0" }}>
          <Tag color="blue">Học kỳ 1</Tag>
        </Divider>

        {semester1Settings.map((item) => (
          <div key={item.key} className={styles.settingItem}>
            <div className={styles.settingLabel}>
              {item.label}
              <Tooltip title={tooltips[item.key]}>
                <InfoCircleOutlined
                  style={{ color: "#1677ff", marginLeft: 8 }}
                />
              </Tooltip>
            </div>
            <div className={styles.settingValue}>{formatDate(item.value)}</div>
          </div>
        ))}

        <Divider style={{ margin: "12px 0" }}>
          <Tag color="green">Học kỳ 2</Tag>
        </Divider>

        {semester2Settings.map((item) => (
          <div key={item.key} className={styles.settingItem}>
            <div className={styles.settingLabel}>
              {item.label}
              <Tooltip title={tooltips[item.key]}>
                <InfoCircleOutlined
                  style={{ color: "#1677ff", marginLeft: 8 }}
                />
              </Tooltip>
            </div>
            <div className={styles.settingValue}>{formatDate(item.value)}</div>
          </div>
        ))}
      </div>

      <Modal
        title="Cài đặt thời gian mượn sách"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={600}
      >
        <div className={styles.modalHeader}>
          <p className={styles.modalDescription}>
            Cấu hình thời gian mượn sách và thời hạn trả sách cho từng học kỳ
          </p>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item
            name="maximumBorrowingPeriodForReferenceMaterials"
            label="Thời gian tối đa mượn tài liệu tham khảo (ngày)"
            rules={[{ required: true, message: "Vui lòng nhập số ngày" }]}
          >
            <Input type="number" min={1} addonAfter="ngày" />
          </Form.Item>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              <CalendarOutlined /> Học kỳ 1
            </h4>
            <Form.Item
              name="semester1_BorrowStartDate"
              label="Ngày bắt đầu mượn sách (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 06-15)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 06-15)" />
            </Form.Item>
            <Form.Item
              name="semester1_BorrowEndDate"
              label="Ngày kết thúc mượn sách (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 12-14)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 12-14)" />
            </Form.Item>
            <Form.Item
              name="semester1_LatestReturnDate"
              label="Ngày trả sách muộn nhất (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 03-14)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 03-14)" />
            </Form.Item>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              <CalendarOutlined /> Học kỳ 2
            </h4>
            <Form.Item
              name="semester2_BorrowStartDate"
              label="Ngày bắt đầu mượn sách (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 12-15)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 12-15)" />
            </Form.Item>
            <Form.Item
              name="semester2_BorrowEndDate"
              label="Ngày kết thúc mượn sách (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 06-14)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 06-14)" />
            </Form.Item>
            <Form.Item
              name="semester2_LatestReturnDate"
              label="Ngày trả sách muộn nhất (MM-DD)"
              rules={[
                { required: true, message: "Vui lòng nhập ngày" },
                {
                  pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                  message: "Nhập định dạng MM-DD (ví dụ: 09-14)",
                },
              ]}
            >
              <Input placeholder="MM-DD (ví dụ: 09-14)" />
            </Form.Item>
          </div>

          <div className={styles.modalFooter}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// Helper function to format date in MM-DD as "Ngày DD tháng MM"
function formatDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-")) {
    return dateStr;
  }

  const [month, day] = dateStr.split("-");
  return `Ngày ${day} tháng ${month}`;
}

export default BorrowingPeriodSettings;
