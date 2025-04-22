// src/components/LibrarySettings/LateFeeSettings.jsx
import React, { useState } from "react";
import { Button, Modal, Form, Input, notification, Tooltip } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "/src/styles/manager/config-system/SettingSection.module.css";
import librarySettingsService from "/src/services/manager/librarySettingsService.js";

const LateFeeSettings = ({ settings, onUpdate }) => {
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

      const response = await librarySettingsService.updateLateFeeSettings(
        values
      );

      if (response.success) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cài đặt phí trễ hạn đã được cập nhật",
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
    lateFeeMultiplier_Textbook_Under3Months:
      "Hệ số phí trễ hạn cho sách giáo trình dưới 3 tháng",
    lateFeeMultiplier_Textbook_Over3Months:
      "Hệ số phí trễ hạn cho sách giáo trình trên 3 tháng",
    lateFeeMultiplier_ReferenceMaterials_Under30Days:
      "Hệ số phí trễ hạn cho tài liệu tham khảo dưới 30 ngày",
    lateFeeMultiplier_ReferenceMaterials_Over30Days:
      "Hệ số phí trễ hạn cho tài liệu tham khảo trên 30 ngày",
  };

  return (
    <div className={styles.settingSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cài đặt phí trễ hạn</h3>
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
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className={styles.settingItem}>
            <div className={styles.settingLabel}>
              {getFieldLabel(key)}
              <Tooltip title={tooltips[key]}>
                <InfoCircleOutlined style={{ color: "#1677ff" }} />
              </Tooltip>
            </div>
            <div className={styles.settingValue}>{value}x</div>
          </div>
        ))}
      </div>

      <Modal
        title="Cài đặt phí trễ hạn"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <div className={styles.modalHeader}>
          <h4 className={styles.modalTitle}>Phí trễ hạn</h4>
          <p className={styles.modalDescription}>
            Hệ số phí trễ hạn sẽ được nhân với mức phí cơ bản để tính phí phạt.
          </p>
        </div>

        <Form form={form} layout="vertical">
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Giáo trình</h4>
            <Form.Item
              name="lateFeeMultiplier_Textbook_Under3Months"
              label="Hệ số phí trễ hạn (dưới 3 tháng)"
              rules={[{ required: true, message: "Vui lòng nhập hệ số" }]}
            >
              <Input type="number" min={0} step={0.1} />
            </Form.Item>
            <Form.Item
              name="lateFeeMultiplier_Textbook_Over3Months"
              label="Hệ số phí trễ hạn (trên 3 tháng)"
              rules={[{ required: true, message: "Vui lòng nhập hệ số" }]}
            >
              <Input type="number" min={0} step={0.1} />
            </Form.Item>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Tài liệu tham khảo</h4>
            <Form.Item
              name="lateFeeMultiplier_ReferenceMaterials_Under30Days"
              label="Hệ số phí trễ hạn (dưới 30 ngày)"
              rules={[{ required: true, message: "Vui lòng nhập hệ số" }]}
            >
              <Input type="number" min={0} step={0.1} />
            </Form.Item>
            <Form.Item
              name="lateFeeMultiplier_ReferenceMaterials_Over30Days"
              label="Hệ số phí trễ hạn (trên 30 ngày)"
              rules={[{ required: true, message: "Vui lòng nhập hệ số" }]}
            >
              <Input type="number" min={0} step={0.1} />
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

// Helper function to get human-readable labels
function getFieldLabel(key) {
  const labels = {
    lateFeeMultiplier_Textbook_Under3Months:
      "Hệ số phí trễ hạn (Giáo trình dưới 3 tháng)",
    lateFeeMultiplier_Textbook_Over3Months:
      "Hệ số phí trễ hạn (Giáo trình trên 3 tháng)",
    lateFeeMultiplier_ReferenceMaterials_Under30Days:
      "Hệ số phí trễ hạn (Tài liệu tham khảo dưới 30 ngày)",
    lateFeeMultiplier_ReferenceMaterials_Over30Days:
      "Hệ số phí trễ hạn (Tài liệu tham khảo trên 30 ngày)",
  };
  return labels[key] || key;
}

export default LateFeeSettings;
