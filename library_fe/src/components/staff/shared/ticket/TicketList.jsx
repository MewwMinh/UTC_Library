// src/components/support/TicketList.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Select,
  Input,
  Button,
  Space,
  Spin,
  notification,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ticketService from "/src/services/shared/ticketService.js";
import styles from "/src/styles/ticket/SupportRequests.module.css";

const { Option } = Select;

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Các loại yêu cầu
  const requestTypes = [
    "Mượn/trả sách",
    "Gia hạn sách",
    "Đặt chỗ phòng đọc",
    "Lỗi hệ thống website/ứng dụng",
    "Cập nhật thông tin cá nhân",
    "Đề xuất sách mới",
    "Khiếu nại về phạt",
    "Hỗ trợ tìm tài liệu",
    "Tài khoản và đăng nhập",
    "Báo cáo sách hỏng",
    "Đề xuất sự kiện/hội thảo",
    "Góp ý cải thiện dịch vụ",
    "Báo cáo cơ sở vật chất/thiết bị",
    "Thắc mắc về điểm thành viên",
    "Vấn đề khác",
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAllHelpTickets();

      if (response.success) {
        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp cho bảng
        const formattedTickets = response.data.map((ticket) => ({
          key: ticket.ticketID,
          id: ticket.ticketID,
          title: ticket.title,
          requesterName: ticket.patronName,
          requestType: ticket.problem,
          createdAt: formatDate(ticket.createdAt),
          status: mapStatusToCode(ticket.status),
          description: ticket.description,
        }));
        setTickets(formattedTickets);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách yêu cầu hỗ trợ",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu cầu:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Chuyển đổi trạng thái từ API sang mã để hiển thị
  const mapStatusToCode = (status) => {
    switch (status) {
      case "Đang chờ xử lý":
        return "pending";
      case "Đang xử lý":
        return "processing";
      case "Đã hoàn thành":
        return "completed";
      case "Bị từ chối":
        return "rejected";
      default:
        return "pending";
    }
  };

  // Hàm lọc dữ liệu
  const getFilteredData = () => {
    return tickets.filter((item) => {
      // Lọc theo văn bản tìm kiếm
      const matchesSearch =
        searchText === "" ||
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.requesterName.toLowerCase().includes(searchText.toLowerCase());

      // Lọc theo trạng thái
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // Lọc theo loại yêu cầu
      const matchesType =
        typeFilter === "all" || item.requestType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  // Reset bộ lọc
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "id",
      key: "id",
      width: 140,
      ellipsis: true,
      render: (id) => (
        <Tooltip title={id}>
          <span>{id.substring(0, 8)}...</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title) => (
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requesterName",
      key: "requesterName",
      width: 150,
      sorter: (a, b) => a.requesterName.localeCompare(b.requesterName),
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "requestType",
      key: "requestType",
      width: 180,
      ellipsis: true,
      render: (type) => (
        <Tooltip title={type}>
          <span>{type}</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.requestType.localeCompare(b.requestType),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color, text, icon, className;
        switch (status) {
          case "pending":
            color = "gold";
            text = "Đang chờ xử lý";
            icon = <ClockCircleOutlined />;
            className = styles.pendingTag;
            break;
          case "processing":
            color = "blue";
            text = "Đang xử lý";
            icon = <SyncOutlined spin />;
            className = styles.processingTag;
            break;
          case "completed":
            color = "green";
            text = "Đã hoàn thành";
            icon = <CheckCircleOutlined />;
            className = styles.completedTag;
            break;
          case "rejected":
            color = "red";
            text = "Bị từ chối";
            icon = <ExclamationCircleOutlined />;
            className = styles.rejectedTag;
            break;
          default:
            color = "default";
            text = status;
            icon = null;
        }
        return (
          <Tag color={color} icon={icon} className={className}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          className={styles.actionButton}
          onClick={() =>
            (window.location.href = `/staff/support-requests/${record.id}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card className={styles.tableCard}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className={styles.searchContainer}>
            <Row gutter={[16, 16]} className={styles.filtersRow}>
              <Col xs={24} md={8}>
                <Input.Search
                  placeholder="Tìm kiếm theo mã, tiêu đề, người gửi..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} md={5}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="pending">Đang chờ xử lý</Option>
                  <Option value="processing">Đang xử lý</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                  <Option value="rejected">Bị từ chối</Option>
                </Select>
              </Col>
              <Col xs={24} md={7}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Lọc theo loại yêu cầu"
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(value)}
                >
                  <Option value="all">Tất cả loại yêu cầu</Option>
                  {requestTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={4}>
                <Space className={styles.tableActions}>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                    Làm mới
                  </Button>
                  <Button type="primary" icon={<SearchOutlined />}>
                    Tìm kiếm
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={getFilteredData()}
            rowKey="key"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} yêu cầu`,
            }}
          />
        </>
      )}
    </Card>
  );
};

export default TicketList;
