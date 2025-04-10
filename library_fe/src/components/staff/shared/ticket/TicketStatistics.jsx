// src/components/support/TicketStatistics.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spin, notification } from "antd";
import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ticketService from "/src/services/shared/ticketService.js";
import styles from "/src/styles/ticket/SupportRequests.module.css";

const TicketStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await ticketService.getTicketStatistics();

        if (response.success) {
          setStatistics(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải thống kê yêu cầu",
          });
        }
      } catch (error) {
        console.error("Error fetching ticket statistics:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]} className={styles.statsRow}>
      <Col xs={24} sm={12} md={4} lg={4}>
        <Card
          bordered={false}
          className={`${styles.statCard} ${styles.totalCard}`}
        >
          <div className={styles.statCardContent}>
            <TeamOutlined className={styles.statIcon} />
            <div className={styles.statTitle}>Tổng số yêu cầu</div>
            <div className={styles.statValue}>
              {statistics?.totalRequests || 0}
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card
          bordered={false}
          className={`${styles.statCard} ${styles.pendingCard}`}
        >
          <div className={styles.statCardContent}>
            <ClockCircleOutlined className={styles.statIcon} />
            <div className={styles.statTitle}>Đang chờ xử lý</div>
            <div className={styles.statValue}>{statistics?.pending || 0}</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card
          bordered={false}
          className={`${styles.statCard} ${styles.processingCard}`}
        >
          <div className={styles.statCardContent}>
            <SyncOutlined spin className={styles.statIcon} />
            <div className={styles.statTitle}>Đang xử lý</div>
            <div className={styles.statValue}>
              {statistics?.processing || 0}
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card
          bordered={false}
          className={`${styles.statCard} ${styles.completedCard}`}
        >
          <div className={styles.statCardContent}>
            <CheckCircleOutlined className={styles.statIcon} />
            <div className={styles.statTitle}>Đã hoàn thành</div>
            <div className={styles.statValue}>{statistics?.completed || 0}</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={5} lg={5}>
        <Card
          bordered={false}
          className={`${styles.statCard} ${styles.rejectedCard}`}
        >
          <div className={styles.statCardContent}>
            <ExclamationCircleOutlined className={styles.statIcon} />
            <div className={styles.statTitle}>Bị từ chối</div>
            <div className={styles.statValue}>{statistics?.rejected || 0}</div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default TicketStatistics;
