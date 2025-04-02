import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Select,
  Input,
  Button,
  Space,
  DatePicker,
} from "antd";
import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const SupportRequestsPage = () => {
  // Dữ liệu mẫu cho thống kê tổng quan
  const statisticsData = {
    totalRequests: 158,
    pendingRequests: 42,
    inProgressRequests: 25,
    completedRequests: 84,
    rejectedRequests: 7,
    averageResponseTime: "6 giờ",
  };

  // Dữ liệu mẫu cho danh sách yêu cầu hỗ trợ
  const requestsData = [
    {
      key: "1",
      id: "YC-2025060001",
      title: 'Gia hạn sách "Lập trình Java cơ bản"',
      requesterName: "Nguyễn Văn A",
      requestType: "Gia hạn sách",
      createdAt: "2025-06-10 09:35:22",
      status: "pending",
      lastUpdated: "2025-06-10 09:35:22",
    },
    {
      key: "2",
      id: "YC-2025060002",
      title: "Đặt chỗ học nhóm ngày 15/06/2025",
      requesterName: "Trần Thị B",
      requestType: "Đặt chỗ phòng đọc",
      createdAt: "2025-06-10 10:22:45",
      status: "processing",
      lastUpdated: "2025-06-10 11:05:30",
    },
    {
      key: "3",
      id: "YC-2025060003",
      title: "Thắc mắc về điểm thành viên",
      requesterName: "Lê Văn C",
      requestType: "Thắc mắc về điểm thành viên",
      createdAt: "2025-06-09 14:50:12",
      status: "completed",
      lastUpdated: "2025-06-09 16:22:40",
    },
    {
      key: "4",
      id: "YC-2025060004",
      title: "Báo cáo sách bị hỏng",
      requesterName: "Phạm Thị D",
      requestType: "Báo cáo sách hỏng",
      createdAt: "2025-06-09 08:15:33",
      status: "rejected",
      lastUpdated: "2025-06-09 09:30:18",
    },
    {
      key: "5",
      id: "YC-2025060005",
      title: 'Đề xuất mua sách mới "Machine Learning cơ bản"',
      requesterName: "Hoàng Văn E",
      requestType: "Đề xuất sách mới",
      createdAt: "2025-06-08 15:40:22",
      status: "completed",
      lastUpdated: "2025-06-09 10:15:50",
    },
    {
      key: "6",
      id: "YC-2025060006",
      title: "Không đăng nhập được tài khoản",
      requesterName: "Đỗ Thị F",
      requestType: "Tài khoản và đăng nhập",
      createdAt: "2025-06-08 11:20:18",
      status: "completed",
      lastUpdated: "2025-06-08 13:42:10",
    },
    {
      key: "7",
      id: "YC-2025060007",
      title: "Khiếu nại về phí phạt trả sách muộn",
      requesterName: "Nguyễn Văn G",
      requestType: "Khiếu nại về phạt",
      createdAt: "2025-06-07 16:30:45",
      status: "pending",
      lastUpdated: "2025-06-07 16:30:45",
    },
  ];

  // State cho các bộ lọc
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Các loại yêu cầu mẫu
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

  // Hàm lọc dữ liệu
  const getFilteredData = () => {
    return requestsData.filter((item) => {
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

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "id",
      key: "id",
      width: 140,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
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
        let color, text, icon;
        switch (status) {
          case "pending":
            color = "gold";
            text = "Đang chờ xử lý";
            icon = <ClockCircleOutlined />;
            break;
          case "processing":
            color = "blue";
            text = "Đang xử lý";
            icon = <SyncOutlined spin />;
            break;
          case "completed":
            color = "green";
            text = "Đã hoàn thành";
            icon = <CheckCircleOutlined />;
            break;
          case "rejected":
            color = "red";
            text = "Bị từ chối";
            icon = <ExclamationCircleOutlined />;
            break;
          default:
            color = "default";
            text = status;
            icon = null;
        }
        return (
          <Tag color={color} icon={icon}>
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
          onClick={() =>
            (window.location.href = `/staff/support-requests/${record.id}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Reset bộ lọc
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý yêu cầu hỗ trợ</h1>

      {/* Component 1: Thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Tổng số yêu cầu"
              value={statisticsData.totalRequests}
              valueStyle={{ color: "#1890ff" }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Đang chờ xử lý"
              value={statisticsData.pendingRequests}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Đang xử lý"
              value={statisticsData.inProgressRequests}
              valueStyle={{ color: "#1890ff" }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Đã hoàn thành"
              value={statisticsData.completedRequests}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Bị từ chối"
              value={statisticsData.rejectedRequests}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="text-center h-full">
            <Statistic
              title="Thời gian phản hồi TB"
              value={statisticsData.averageResponseTime}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Component 2: Bảng danh sách yêu cầu hỗ trợ */}
      <Card className="mb-6">
        <div className="mb-4">
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} md={8}>
              <Input.Search
                placeholder="Tìm kiếm theo mã, tiêu đề, người gửi..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
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
              <Space>
                <Button onClick={resetFilters}>Làm mới</Button>
                <Button type="primary">Tìm kiếm</Button>
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
      </Card>
    </div>
  );
};

export default SupportRequestsPage;
