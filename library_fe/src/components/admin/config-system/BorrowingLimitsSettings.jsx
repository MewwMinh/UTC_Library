// src/components/LibrarySettings/BorrowingLimitsSettings.jsx
import React, { useState } from "react";
import { Button, Modal, Form, Input, notification, Tooltip, Badge } from "antd";
import {
  EditOutlined,
  InfoCircleOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/manager/config-system/SettingSection.module.css";
import librarySettingsService from "/src/services/manager/librarySettingsService.js";

const BorrowingLimitsSettings = ({ settings, onUpdate }) => {
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
        await librarySettingsService.updateBorrowingLimitsSettings(values);

      if (response.success) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Cài đặt giới hạn mượn sách đã được cập nhật",
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
    maxTextbooks_BronzeMember:
      "Số lượng giáo trình tối đa mà thành viên hạng Đồng có thể mượn",
    maxTextbooks_SilverMember:
      "Số lượng giáo trình tối đa mà thành viên hạng Bạc có thể mượn",
    maxTextbooks_GoldMember:
      "Số lượng giáo trình tối đa mà thành viên hạng Vàng có thể mượn",
    maxReferenceMaterials_BronzeMember:
      "Số lượng tài liệu tham khảo tối đa mà thành viên hạng Đồng có thể mượn",
    maxReferenceMaterials_SilverMember:
      "Số lượng tài liệu tham khảo tối đa mà thành viên hạng Bạc có thể mượn",
    maxReferenceMaterials_GoldMember:
      "Số lượng tài liệu tham khảo tối đa mà thành viên hạng Vàng có thể mượn",
  };

  // Func to render member badge with color
  const getMemberBadge = (key) => {
    if (key.includes("Bronze")) {
      return <Badge color="#CD7F32" text="Đồng" />;
    } else if (key.includes("Silver")) {
      return <Badge color="#C0C0C0" text="Bạc" />;
    } else if (key.includes("Gold")) {
      return <Badge color="#FFD700" text="Vàng" />;
    }
    return null;
  };

  return (
    <div className={styles.settingSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cài đặt giới hạn mượn sách</h3>
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
        {Object.entries(settings).map(([key, value]) => {
          const isTextbook = key.includes("Textbooks");
          return (
            <div key={key} className={styles.settingItem}>
              <div className={styles.settingLabel}>
                {isTextbook ? "Giáo trình - " : "Tài liệu tham khảo - "}
                {getMemberBadge(key)}
                <Tooltip title={tooltips[key]}>
                  <InfoCircleOutlined
                    style={{ color: "#1677ff", marginLeft: 8 }}
                  />
                </Tooltip>
              </div>
              <div className={styles.settingValue}>{value} quyển</div>
            </div>
          );
        })}
      </div>

      <Modal
        title="Cài đặt giới hạn mượn sách"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>Giới hạn giáo trình</h4>
            <Form.Item
              name="maxTextbooks_BronzeMember"
              label={
                <span>
                  Số lượng giáo trình tối đa -{" "}
                  <Badge color="#CD7F32" text="Hạng Đồng" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
            </Form.Item>
            <Form.Item
              name="maxTextbooks_SilverMember"
              label={
                <span>
                  Số lượng giáo trình tối đa -{" "}
                  <Badge color="#C0C0C0" text="Hạng Bạc" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
            </Form.Item>
            <Form.Item
              name="maxTextbooks_GoldMember"
              label={
                <span>
                  Số lượng giáo trình tối đa -{" "}
                  <Badge color="#FFD700" text="Hạng Vàng" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
            </Form.Item>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.formSectionTitle}>
              Giới hạn tài liệu tham khảo
            </h4>
            <Form.Item
              name="maxReferenceMaterials_BronzeMember"
              label={
                <span>
                  Số lượng tài liệu tham khảo tối đa -{" "}
                  <Badge color="#CD7F32" text="Hạng Đồng" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
            </Form.Item>
            <Form.Item
              name="maxReferenceMaterials_SilverMember"
              label={
                <span>
                  Số lượng tài liệu tham khảo tối đa -{" "}
                  <Badge color="#C0C0C0" text="Hạng Bạc" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
            </Form.Item>
            <Form.Item
              name="maxReferenceMaterials_GoldMember"
              label={
                <span>
                  Số lượng tài liệu tham khảo tối đa -{" "}
                  <Badge color="#FFD700" text="Hạng Vàng" />
                </span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <Input type="number" min={0} addonAfter="quyển" />
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

export default BorrowingLimitsSettings;
