/* eslint-disable no-unused-vars */
// src/components/reading-room/PatronsInReadingRoom.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  notification,
  Card,
  Avatar,
  Typography,
  Popconfirm,
  Tag,
  Empty,
  Spin,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import readingRoomService from "/src/services/coordinator/readingRoomService.js";
import styles from "/src/styles/ReadingRoom.module.css";

const { Title } = Typography;

// eslint-disable-next-line react/prop-types
const PatronsInReadingRoom = ({ refreshTrigger }) => {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Tính thời gian ở trong thư viện (giờ, phút)
  const calculateDuration = (checkInTime) => {
    const checkIn = new Date(checkInTime);
    const now = new Date();
    const diff = Math.abs(now - checkIn);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  const fetchPatrons = async () => {
    setLoading(true);
    try {
      const response = await readingRoomService.getPatronsInReadingRoom();
      if (response.success) {
        setPatrons(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách bạn đọc",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrons();
  }, [refreshTrigger]); // Tải lại khi refreshTrigger thay đổi

  const handleCheckOut = async (recordID) => {
    try {
      const response = await readingRoomService.checkOutPatron(recordID);
      if (response.success) {
        notification.success({
          message: "Check-out thành công",
          description: response.message,
          placement: "bottomRight",
        });
        // Xóa bạn đọc đã check-out khỏi danh sách
        setPatrons(patrons.filter((patron) => patron.recordID !== recordID));
      } else {
        notification.error({
          message: "Check-out thất bại",
          description: response.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể thực hiện check-out. Vui lòng thử lại sau.",
        placement: "bottomRight",
      });
    }
  };

  const handleRowClick = (userID) => {
    navigate(`/staff/patron-info/${userID}`);
  };

  // Lọc bạn đọc theo ô tìm kiếm
  const filteredPatrons = patrons.filter(
    (patron) =>
      patron.patronName.toLowerCase().includes(searchText.toLowerCase()) ||
      patron.patronID.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Bạn đọc",
      dataIndex: "patronName",
      key: "patronName",
      render: (text, record) => (
        <div className={styles.patronInfo}>
          <Avatar
            src={record.patronImage}
            icon={!record.patronImage && <UserOutlined />}
            size={40}
          />
          <div className={styles.patronDetails}>
            <div className={styles.patronName}>{text}</div>
            <div className={styles.patronId}>{record.patronID}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian trong thư viện",
      dataIndex: "checkInTime",
      key: "duration",
      render: (text) => (
        <span>
          <ClockCircleOutlined /> {calculateDuration(text)}
        </span>
      ),
    },
    {
      title: "Check-in bởi",
      dataIndex: "checkInBy",
      key: "checkInBy",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận check-out"
          description="Bạn có chắc chắn muốn check-out bạn đọc này?"
          onConfirm={() => handleCheckOut(record.recordID)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            className={styles.checkOutButton}
          >
            Check-out
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card className={styles.patronsCard} variant="borderless">
      <div className={styles.patronsHeader}>
        <Title level={4} className={styles.cardTitle}>
          <UserOutlined /> Bạn đọc trong phòng đọc
        </Title>
        <Input
          placeholder="Tìm kiếm bạn đọc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredPatrons}
          columns={columns}
          rowKey="recordID"
          pagination={{
            pageSize: 8,
            position: ["bottomCenter"],
            showSizeChanger: false,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có bạn đọc nào trong phòng đọc"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          className={styles.patronsTable}
          onRow={(record) => ({
            onClick: (event) => {
              // Chỉ xử lý click nếu không phải click vào nút
              if (
                !event.target.closest("button") &&
                !event.target.closest(".ant-popover-content")
              ) {
                handleRowClick(record.patronID);
              }
            },
            className: styles.tableRow,
          })}
        />
      )}
    </Card>
  );
};

export default PatronsInReadingRoom;
