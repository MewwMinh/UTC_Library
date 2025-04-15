import { useState, useEffect } from "react";
import { Table, Tag, Empty, notification, Tooltip } from "antd";
import {
  WarningOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import moment from "moment";
import patronService from "/src/services/coordinator/patronService.js";
import styles from "/src/styles/members/ViolationHistory.module.css";
import { useParams } from "react-router-dom";

const ViolationHistory = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { patronID } = useParams();

  useEffect(() => {
    const fetchViolationHistory = async () => {
      try {
        setLoading(true);
        const response = await patronService.getViolationHistory(patronID);

        if (response.success) {
          // Thêm key cho mỗi vi phạm
          const violationsWithKeys = response.data.map((item, index) => ({
            ...item,
            key: index.toString(),
          }));
          setViolations(violationsWithKeys);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể tải lịch sử vi phạm",
          });
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    if (patronID) {
      fetchViolationHistory();
    }
  }, [patronID]);

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Xác định mức độ nghiêm trọng của vi phạm dựa trên số điểm trừ
  const getSeverityLevel = (pointsDeducted) => {
    if (pointsDeducted >= 15) {
      return { color: "error", text: "Nghiêm trọng" };
    } else if (pointsDeducted >= 8) {
      return { color: "warning", text: "Đáng kể" };
    } else {
      return { color: "default", text: "Nhẹ" };
    }
  };

  const columns = [
    {
      title: "Loại vi phạm",
      dataIndex: "violationType",
      key: "violationType",
      render: (text) => (
        <div className={styles.violationTypeContainer}>
          <WarningOutlined className={styles.violationIcon} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Chi tiết vi phạm",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div className={styles.descriptionContainer}>
            <FileTextOutlined className={styles.descriptionIcon} />
            <span className={styles.description}>{text}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày vi phạm",
      dataIndex: "violationDate",
      key: "violationDate",
      render: (date) => (
        <div className={styles.dateContainer}>
          <ClockCircleOutlined className={styles.dateIcon} />
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: "Xử lý bởi",
      dataIndex: "staffName",
      key: "staffName",
      render: (text) => (
        <div className={styles.staffContainer}>
          <UserOutlined className={styles.staffIcon} />
          {text}
        </div>
      ),
    },
    {
      title: "Chi phí phạt",
      dataIndex: "penaltyAmount",
      key: "penaltyAmount",
      render: (amount) => (
        <div className={styles.penaltyContainer}>
          <MoneyCollectOutlined className={styles.penaltyIcon} />
          <span className={styles.penaltyAmount}>{formatCurrency(amount)}</span>
        </div>
      ),
    },
    {
      title: "Điểm trừ",
      dataIndex: "pointsDeducted",
      key: "pointsDeducted",
      render: (points) => (
        <Tag color="red" className={styles.pointsTag}>
          -{points} điểm
        </Tag>
      ),
    },
    {
      title: "Mức độ",
      key: "severity",
      render: (_, record) => {
        const { color, text } = getSeverityLevel(record.pointsDeducted);
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className={styles.violationHistoryContainer}>
      {violations.length > 0 ? (
        <Table
          dataSource={violations}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Tổng cộng ${total} vi phạm`,
          }}
          className={styles.violationTable}
          summary={(pageData) => {
            // Tính tổng điểm trừ và tiền phạt
            let totalPoints = 0;
            let totalAmount = 0;

            pageData.forEach(({ pointsDeducted, penaltyAmount }) => {
              totalPoints += pointsDeducted || 0;
              totalAmount += penaltyAmount || 0;
            });

            return (
              <Table.Summary.Row className={styles.summaryRow}>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <strong>Tổng cộng</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong className={styles.totalAmount}>
                    {formatCurrency(totalAmount)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Tag color="red" className={styles.totalPointsTag}>
                    <strong>-{totalPoints} điểm</strong>
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      ) : (
        <Empty
          description={loading ? "Đang tải dữ liệu..." : "Không có vi phạm nào"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.emptyState}
        />
      )}
    </div>
  );
};

export default ViolationHistory;
