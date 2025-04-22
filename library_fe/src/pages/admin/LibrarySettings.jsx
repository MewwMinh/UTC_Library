// src/components/LibrarySettings/LibrarySettings.jsx
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Typography,
  Divider,
  notification,
} from "antd";
import {
  SettingOutlined,
  ReloadOutlined,
  BookOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/manager/config-system/LibrarySettings.module.css";
import librarySettingsService from "/src/services/manager/librarySettingsService.js";

// Import các component con
import {
  BorrowingLimitsSettings,
  BorrowingPeriodSettings,
  LateFeeSettings,
  RewardsAndPenaltiesSettings,
} from "/src/components/admin/config-system";
// import LateFeeSettings from "./LateFeeSettings";
// import BorrowingLimitsSettings from "./BorrowingLimitsSettings";
// import BorrowingPeriodSettings from "./BorrowingPeriodSettings";

const { Title, Text } = Typography;

const LibrarySettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await librarySettingsService.getAllSettings();

      if (response.success) {
        setSettings(response.data);
      } else {
        setError(response.message || "Không thể tải cấu hình hệ thống");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi kết nối với máy chủ");
      console.error("Error fetching library settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Hàm cập nhật cài đặt khi các component con thay đổi
  const handleUpdateRewardsAndPenalties = (newSettings) => {
    setSettings({
      ...settings,
      rewardsAndPenaltiesSettings: newSettings,
    });
  };

  const handleUpdateLateFees = (newSettings) => {
    setSettings({
      ...settings,
      lateFeeSettings: newSettings,
    });
  };

  const handleUpdateBorrowingLimits = (newSettings) => {
    setSettings({
      ...settings,
      borrowingLimitsSettings: newSettings,
    });
  };

  const handleUpdateBorrowingPeriods = (newSettings) => {
    setSettings({
      ...settings,
      borrowingPeriodSettings: newSettings,
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tải cấu hình hệ thống..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>
            <SettingOutlined /> Lỗi khi tải cấu hình
          </h2>
          <p className={styles.errorMessage}>{error}</p>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchSettings}
            className={styles.retryButton}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          <SettingOutlined className={styles.titleIcon} /> Cấu hình hệ thống thư
          viện
        </Title>
        <Text type="secondary" className={styles.description}>
          Quản lý các cài đặt hệ thống thư viện bao gồm điểm thưởng, phí phạt,
          giới hạn mượn sách và thời gian mượn sách. Những thay đổi sẽ được áp
          dụng ngay lập tức cho toàn bộ hệ thống.
        </Text>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.settingsGrid}>
        <Col>
          <RewardsAndPenaltiesSettings
            settings={settings.rewardsAndPenaltiesSettings}
            onUpdate={handleUpdateRewardsAndPenalties}
          />
        </Col>
        <Col>
          <LateFeeSettings
            settings={settings.lateFeeSettings}
            onUpdate={handleUpdateLateFees}
          />
        </Col>
        <Col>
          <BorrowingLimitsSettings
            settings={settings.borrowingLimitsSettings}
            onUpdate={handleUpdateBorrowingLimits}
          />
        </Col>
        <Col>
          <BorrowingPeriodSettings
            settings={settings.borrowingPeriodSettings}
            onUpdate={handleUpdateBorrowingPeriods}
          />
        </Col>
      </div>
    </div>
  );
};

export default LibrarySettings;
