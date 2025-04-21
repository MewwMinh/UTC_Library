import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Button,
  Space,
  Pagination,
  Tooltip,
  Typography,
  Empty,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "/src/services/coordinator/eventService.js";
import styles from "/src/styles/eventStaff/EventParticipantsList.module.css";

const { Text, Title } = Typography;
const { Option } = Select;

const EventParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { eventId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await eventService.getEventParticipants(eventId);

      if (response.success) {
        setParticipants(response.data);
      } else {
        console.error("Error fetching participants:", response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách theo tên và trạng thái
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const matchesSearch =
        participant.patronName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        participant.patronID.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || participant.attendanceStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  // Phân trang
  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredParticipants.slice(startIndex, startIndex + pageSize);
  }, [filteredParticipants, currentPage, pageSize]);

  // Status tag render function
  const renderStatusTag = (status) => {
    let color = "";
    switch (status) {
      case "Đã đăng ký":
        color = "blue";
        break;
      case "Đã hủy đăng ký":
        color = "gray";
        break;
      case "Đã tham gia":
        color = "green";
        break;
      case "Không tham gia":
        color = "red";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  // Format date
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navigateToPatronInfo = (patronId) => {
    navigate(`/staff/patron-info/${patronId}`);
  };

  const columns = [
    {
      title: "Mã bạn đọc",
      dataIndex: "patronID",
      key: "patronID",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Họ tên",
      dataIndex: "patronName",
      key: "patronName",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "attendanceStatus",
      key: "attendanceStatus",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Thời gian đăng ký",
      dataIndex: "registerTime",
      key: "registerTime",
      render: (dateTime) => (
        <Tooltip title={formatDateTime(dateTime)}>
          <span>
            <CalendarOutlined /> {formatDateTime(dateTime)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigateToPatronInfo(record.patronID);
          }}
          size="middle"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={4} className={styles.title}>
        Danh sách bạn đọc đăng ký tham gia sự kiện
      </Title>

      <div className={styles.filters}>
        <Space size="middle" className={styles.filterGroup}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã bạn đọc"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
            }}
            className={styles.searchInput}
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1); // Reset về trang 1 khi lọc
            }}
            className={styles.statusFilter}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="Đã đăng ký">Đã đăng ký</Option>
            <Option value="Đã hủy đăng ký">Đã hủy đăng ký</Option>
            <Option value="Đã tham gia">Đã tham gia</Option>
            <Option value="Không tham gia">Không tham gia</Option>
          </Select>
        </Space>

        <Text className={styles.resultCount}>
          Hiển thị {paginatedParticipants.length} /{" "}
          {filteredParticipants.length} kết quả
        </Text>
      </div>

      {filteredParticipants.length > 0 || loading ? (
        <Table
          dataSource={paginatedParticipants}
          columns={columns}
          rowKey="patronID"
          loading={loading}
          pagination={false}
          className={styles.table}
          onRow={(record) => ({
            onClick: () => navigateToPatronInfo(record.patronID),
            className: styles.tableRow,
          })}
        />
      ) : (
        <Empty
          className={styles.emptyState}
          description="Không tìm thấy bạn đọc nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {filteredParticipants.length > 0 && (
        <div className={styles.pagination}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredParticipants.length}
            onChange={(page) => setCurrentPage(page)}
            onShowSizeChange={(current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Tổng cộng ${total} bạn đọc`}
          />
        </div>
      )}
    </div>
  );
};

export default EventParticipantsList;
