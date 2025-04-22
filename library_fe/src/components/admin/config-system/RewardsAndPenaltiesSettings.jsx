// src/components/LibrarySettings/RewardsAndPenaltiesSettings.jsx
import React, { useState } from "react";
import { Button, Modal, Form, Input, notification, Tooltip } from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "/src/styles/manager/config-system/SettingSection.module.css";
import librarySettingsService from "/src/services/manager/librarySettingsService.js";

const RewardsAndPenaltiesSettings = ({ settings, onUpdate }) => {
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
        await librarySettingsService.updateRewardsAndPenaltiesSettings(values);

      if (response.success) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cài đặt điểm thưởng và phạt đã được cập nhật",
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
    bonusPointsForOnTimeBookReturn: "Số điểm cộng khi trả sách đúng hạn",
    pointsDeductedForLateTextbookReturn:
      "Số điểm trừ khi trả sách giáo trình trễ hạn",
    pointsDeductedForLateReferenceMaterialsReturn:
      "Số điểm trừ khi trả tài liệu tham khảo trễ hạn",
    pointsDeductedForDamagedBook: "Số điểm trừ khi làm hỏng sách",
    pointsDeductedForLostBook: "Số điểm trừ khi làm mất sách",
  };

  return (
    <div className={styles.settingSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cài đặt điểm thưởng & phạt</h3>
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
            <div className={styles.settingValue}>{value} điểm</div>
          </div>
        ))}
      </div>

      <Modal
        title="Cài đặt điểm thưởng & phạt"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="bonusPointsForOnTimeBookReturn"
            label="Điểm thưởng khi trả sách đúng hạn"
            rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="pointsDeductedForLateTextbookReturn"
            label="Điểm trừ khi trả sách giáo trình trễ hạn"
            rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="pointsDeductedForLateReferenceMaterialsReturn"
            label="Điểm trừ khi trả tài liệu tham khảo trễ hạn"
            rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="pointsDeductedForDamagedBook"
            label="Điểm trừ khi làm hỏng sách"
            rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="pointsDeductedForLostBook"
            label="Điểm trừ khi làm mất sách"
            rules={[{ required: true, message: "Vui lòng nhập số điểm" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

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
    bonusPointsForOnTimeBookReturn: "Điểm thưởng khi trả sách đúng hạn",
    pointsDeductedForLateTextbookReturn:
      "Điểm trừ khi trả sách giáo trình trễ hạn",
    pointsDeductedForLateReferenceMaterialsReturn:
      "Điểm trừ khi trả tài liệu tham khảo trễ hạn",
    pointsDeductedForDamagedBook: "Điểm trừ khi làm hỏng sách",
    pointsDeductedForLostBook: "Điểm trừ khi làm mất sách",
  };
  return labels[key] || key;
}

export default RewardsAndPenaltiesSettings;
