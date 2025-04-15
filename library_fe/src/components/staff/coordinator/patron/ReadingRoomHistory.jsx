import { useState, useEffect } from "react";
import { Table, Tag, Badge, Empty, notification } from "antd";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import patronService from "/src/services/coordinator/patronService.js";
import styles from "/src/styles/members/ReadingRoomHistory.module.css";
import { useParams } from "react-router-dom";

const ReadingRoomHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { patronID } = useParams();

  useEffect(() => {
    const fetchReadingRoomHistory = async () => {
      try {
        setLoading(true);
        const response = await patronService.getReadingRoomHistory(patronID);

        if (response.success) {
          // Thêm key cho mỗi bản ghi để React có thể render list tốt hơn
          const historyWithKeys = response.data.map((item, index) => ({
            ...item,
            key: index.toString(),
          }));
          setHistory(historyWithKeys);
        } else {
          notification.error({
            message: "Lỗi",
            description:
              response.message || "Không thể tải lịch sử sử dụng phòng đọc",
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
      fetchReadingRoomHistory();
    }
  }, [patronID]);

  // Format ngày giờ
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "—";
    return moment(dateTimeString).format("DD/MM/YYYY HH:mm");
  };

  // Tính thời gian sử dụng phòng đọc
  const calculateDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return "—";

    const start = moment(checkInTime);
    const end = moment(checkOutTime);
    const duration = moment.duration(end.diff(start));

    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;

    if (hours === 0) {
      return `${minutes} phút`;
    }

    return `${hours} giờ ${minutes} phút`;
  };

  const columns = [
    {
      title: "Thời gian vào",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (text) => (
        <div className={styles.timeInfo}>
          <LoginOutlined className={styles.timeIcon} />
          {formatDateTime(text)}
        </div>
      ),
    },
    {
      title: "Thời gian ra",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (text) => (
        <div className={styles.timeInfo}>
          <LogoutOutlined className={styles.timeIcon} />
          {formatDateTime(text)}
        </div>
      ),
    },
    {
      title: "Thời gian sử dụng",
      key: "duration",
      render: (_, record) => (
        <Tag color="blue">
          {calculateDuration(record.checkInTime, record.checkOutTime)}
        </Tag>
      ),
    },
    {
      title: "Nhân viên check-in",
      dataIndex: "checkInBy",
      key: "checkInBy",
      render: (text) => (
        <div className={styles.staffInfo}>
          <UserOutlined className={styles.staffIcon} />
          {text}
        </div>
      ),
    },
    {
      title: "Nhân viên check-out",
      dataIndex: "checkOutBy",
      key: "checkOutBy",
      render: (text) => (
        <div className={styles.staffInfo}>
          <UserOutlined className={styles.staffIcon} />
          {text}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Badge
          status={record.checkOutTime ? "success" : "processing"}
          text={record.checkOutTime ? "Đã hoàn thành" : "Đang sử dụng"}
        />
      ),
    },
  ];

  return (
    <div className={styles.readingRoomHistoryContainer}>
      <Table
        dataSource={history}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `Tổng cộng ${total} bản ghi`,
        }}
        locale={{
          emptyText: <Empty description="Không có lịch sử sử dụng phòng đọc" />,
        }}
        className={styles.historyTable}
      />
    </div>
  );
};

export default ReadingRoomHistory;
