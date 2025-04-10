import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Badge,
  Avatar,
  Tabs,
  Tag,
  Tooltip,
  Modal,
  Form,
  Radio,
  Space,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Progress,
  Empty,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  FireFilled,
  IdcardOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/members/MemberManagement.module.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock data for members
const memberData = [
  {
    id: "20240001",
    name: "Nguyễn Văn An",
    gender: "Nam",
    dateOfBirth: "1999-05-15",
    email: "an.nguyen@utc.edu.vn",
    membershipType: "Vàng",
    memberPoints: 350,
    status: "Hoạt động",
    createdAt: "2022-09-01",
    expiryDate: "2025-09-01",
    photo: null,
    violations: 0,
    lastVisit: "2024-03-28",
    booksBorrowed: 45,
    facultyDepartment: "Khoa Công nghệ thông tin",
  },
  {
    id: "20240002",
    name: "Trần Thị Bích",
    gender: "Nữ",
    dateOfBirth: "2001-08-22",
    email: "bich.tran@utc.edu.vn",
    membershipType: "Bạc",
    memberPoints: 220,
    status: "Hoạt động",
    createdAt: "2022-09-15",
    expiryDate: "2025-09-15",
    photo: null,
    violations: 1,
    lastVisit: "2024-03-27",
    booksBorrowed: 32,
    facultyDepartment: "Khoa Xây dựng",
  },
  {
    id: "20240003",
    name: "Lê Minh Cường",
    gender: "Nam",
    dateOfBirth: "2000-03-10",
    email: "cuong.le@utc.edu.vn",
    membershipType: "Đồng",
    memberPoints: 120,
    status: "Hoạt động",
    createdAt: "2022-09-05",
    expiryDate: "2025-09-05",
    photo: null,
    violations: 0,
    lastVisit: "2024-03-25",
    booksBorrowed: 20,
    facultyDepartment: "Khoa Điện - Điện tử",
  },
  {
    id: "20240004",
    name: "Phạm Thị Dung",
    gender: "Nữ",
    dateOfBirth: "2002-01-05",
    email: "dung.pham@utc.edu.vn",
    membershipType: "Bạc",
    memberPoints: 180,
    status: "Hoạt động",
    createdAt: "2022-10-10",
    expiryDate: "2025-10-10",
    photo: null,
    violations: 2,
    lastVisit: "2024-03-20",
    booksBorrowed: 28,
    facultyDepartment: "Khoa Kinh tế vận tải",
  },
  {
    id: "20240005",
    name: "Hoàng Văn Đức",
    gender: "Nam",
    dateOfBirth: "2000-07-18",
    email: "duc.hoang@utc.edu.vn",
    membershipType: "Vàng",
    memberPoints: 420,
    status: "Hoạt động",
    createdAt: "2022-08-20",
    expiryDate: "2025-08-20",
    photo: null,
    violations: 0,
    lastVisit: "2024-03-28",
    booksBorrowed: 52,
    facultyDepartment: "Khoa Công nghệ thông tin",
  },
  {
    id: "20240006",
    name: "Mai Thị Hiền",
    gender: "Nữ",
    dateOfBirth: "2001-12-03",
    email: "hien.mai@utc.edu.vn",
    membershipType: "Đồng",
    memberPoints: 85,
    status: "Tạm khóa",
    createdAt: "2023-01-15",
    expiryDate: "2026-01-15",
    photo: null,
    violations: 3,
    lastVisit: "2024-02-18",
    booksBorrowed: 15,
    facultyDepartment: "Khoa Vận tải - Kinh tế",
  },
];

// Mock data for achievements
const achievementsData = [
  {
    id: 1,
    type: "Đọc sách",
    title: "Đọc giả hạng vàng",
    description: "Đã mượn trên 50 cuốn sách",
    points: 100,
    awardedDate: "2024-02-15",
  },
  {
    id: 2,
    type: "Tham gia sự kiện",
    title: "Người tham gia tích cực",
    description: "Tham gia 5 sự kiện của thư viện",
    points: 50,
    awardedDate: "2023-12-10",
  },
  {
    id: 3,
    type: "Đánh giá sách",
    title: "Người đánh giá nhiệt tình",
    description: "Đã đánh giá 10 cuốn sách",
    points: 30,
    awardedDate: "2024-01-20",
  },
];

// Mock data for violations
const violationsData = [
  {
    id: 1,
    type: "Trả sách trễ hạn",
    description: 'Trả sách "Lập trình Python" trễ 5 ngày',
    points: -10,
    fineAmount: 50000,
    recordedDate: "2023-11-20",
    recordedBy: "Nguyễn Thị Hương",
  },
  {
    id: 2,
    type: "Làm hư sách",
    description: 'Làm rách bìa sách "Giải tích 1"',
    points: -20,
    fineAmount: 100000,
    recordedDate: "2024-01-15",
    recordedBy: "Trần Văn Bình",
  },
];

// Mock data for book borrowing history
const borrowingHistoryData = [
  {
    id: 1,
    bookTitle: "Lập trình hướng đối tượng với Java",
    borrowDate: "2024-02-01",
    dueDate: "2024-02-15",
    returnDate: "2024-02-14",
    status: "Đã trả",
    approvedBy: "Trần Văn Bình",
  },
  {
    id: 2,
    bookTitle: "Nhập môn trí tuệ nhân tạo",
    borrowDate: "2024-02-20",
    dueDate: "2024-03-05",
    returnDate: "2024-03-07",
    status: "Trả trễ",
    approvedBy: "Nguyễn Thị Hương",
  },
  {
    id: 3,
    bookTitle: "Cơ sở dữ liệu nâng cao",
    borrowDate: "2024-03-10",
    dueDate: "2024-03-24",
    returnDate: null,
    status: "Đang mượn",
    approvedBy: "Lê Thị Giang",
  },
];

// Mock data for library usage history
const libraryUsageData = [
  {
    id: 1,
    date: "2024-03-28",
    checkInTime: "08:30:00",
    checkOutTime: "11:45:00",
    duration: "3h 15m",
    area: "Khu vực đọc cá nhân",
  },
  {
    id: 2,
    date: "2024-03-25",
    checkInTime: "13:15:00",
    checkOutTime: "16:30:00",
    duration: "3h 15m",
    area: "Khu vực học nhóm",
  },
  {
    id: 3,
    date: "2024-03-20",
    checkInTime: "09:00:00",
    checkOutTime: "12:00:00",
    duration: "3h 00m",
    area: "Khu vực đọc cá nhân",
  },
];

const MemberManagement = () => {
  // State for search and filter
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    membershipType: null,
    status: null,
    dateRange: null,
  });

  // State for modal visibility
  const [memberDetailVisible, setMemberDetailVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Form instance for edit mode
  const [form] = Form.useForm();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchText("");
    setFilters({
      membershipType: null,
      status: null,
      dateRange: null,
    });
  };

  // Filter data based on search and filters
  const filteredData = memberData.filter((member) => {
    // Text search
    const textMatch =
      !searchText ||
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.id.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase());

    // Membership type filter
    const membershipMatch =
      !filters.membershipType ||
      member.membershipType === filters.membershipType;

    // Status filter
    const statusMatch = !filters.status || member.status === filters.status;

    // Date range filter (creation date)
    const dateMatch =
      !filters.dateRange ||
      (new Date(member.createdAt) >=
        filters.dateRange[0].startOf("day").toDate() &&
        new Date(member.createdAt) <=
          filters.dateRange[1].endOf("day").toDate());

    return textMatch && membershipMatch && statusMatch && dateMatch;
  });

  // Show member detail modal
  const showMemberDetail = (record) => {
    setSelectedMember(record);
    setMemberDetailVisible(true);
    setEditMode(false);

    // Set form values for potential editing
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      dateOfBirth: record.dateOfBirth ? moment(record.dateOfBirth) : null,
      email: record.email,
      membershipType: record.membershipType,
      status: record.status,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
      facultyDepartment: record.facultyDepartment,
    });
  };

  // Close member detail modal
  const closeMemberDetail = () => {
    setMemberDetailVisible(false);
    setSelectedMember(null);
    setEditMode(false);
  };

  // Handle form submission in edit mode
  const handleFormSubmit = (values) => {
    console.log("Updated member values:", values);
    // Here you would call the API to update the member
    // Then update the local state

    // For demo purposes, just close the modal
    setEditMode(false);
    message.success("Thông tin thành viên đã được cập nhật!");
  };

  // Render membership badge with appropriate icon
  const renderMembershipBadge = (type) => {
    switch (type) {
      case "Vàng":
        return (
          <span className={styles.memberLevel}>
            <FireFilled className={styles.goldIcon} /> Vàng
          </span>
        );
      case "Bạc":
        return (
          <span className={styles.memberLevel}>
            <FireFilled className={styles.silverIcon} /> Bạc
          </span>
        );
      case "Đồng":
        return (
          <span className={styles.memberLevel}>
            <FireFilled className={styles.bronzeIcon} /> Đồng
          </span>
        );
      default:
        return type;
    }
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Hoạt động":
        return <Badge status="success" text="Hoạt động" />;
      case "Tạm khóa":
        return <Badge status="error" text="Tạm khóa" />;
      case "Hết hạn":
        return <Badge status="default" text="Hết hạn" />;
      default:
        return <Badge status="processing" text={status} />;
    }
  };

  // Column definitions for the main table
  const columns = [
    {
      title: "Mã thành viên",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className={styles.avatarContainer}>
          <Avatar icon={<UserOutlined />} src={record.photo} />
          <span className={styles.avatarName}>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Hạng thành viên",
      dataIndex: "membershipType",
      key: "membershipType",
      render: (text) => renderMembershipBadge(text),
      sorter: (a, b) => {
        const order = { Vàng: 3, Bạc: 2, Đồng: 1 };
        return order[a.membershipType] - order[b.membershipType];
      },
    },
    {
      title: "Điểm",
      dataIndex: "memberPoints",
      key: "memberPoints",
      sorter: (a, b) => a.memberPoints - b.memberPoints,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => renderStatusBadge(text),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => showMemberDetail(record)}
          >
            Chi tiết
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />}>
                  Chỉnh sửa
                </Menu.Item>
                <Menu.Item
                  key="status"
                  icon={
                    record.status === "Hoạt động" ? (
                      <StopOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                >
                  {record.status === "Hoạt động" ? "Tạm khóa" : "Kích hoạt"}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                  Xóa
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Column definitions for borrowing history table
  const borrowingColumns = [
    {
      title: "Tên sách",
      dataIndex: "bookTitle",
      key: "bookTitle",
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày hẹn trả",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "Chưa trả",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        if (text === "Đã trả") return <Tag color="success">Đã trả</Tag>;
        if (text === "Trả trễ") return <Tag color="error">Trả trễ</Tag>;
        if (text === "Đang mượn")
          return <Tag color="processing">Đang mượn</Tag>;
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: "Người xử lý",
      dataIndex: "approvedBy",
      key: "approvedBy",
    },
  ];

  // Column definitions for library usage table
  const usageColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkInTime",
      key: "checkInTime",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
    },
    {
      title: "Thời gian sử dụng",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Khu vực",
      dataIndex: "area",
      key: "area",
    },
  ];

  // Column definitions for achievements table
  const achievementsColumns = [
    {
      title: "Loại thành tích",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Điểm thưởng",
      dataIndex: "points",
      key: "points",
      render: (points) => <Tag color="green">+{points}</Tag>,
    },
    {
      title: "Ngày đạt được",
      dataIndex: "awardedDate",
      key: "awardedDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
  ];

  // Column definitions for violations table
  const violationsColumns = [
    {
      title: "Loại vi phạm",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Điểm trừ",
      dataIndex: "points",
      key: "points",
      render: (points) => <Tag color="red">{points}</Tag>,
    },
    {
      title: "Tiền phạt",
      dataIndex: "fineAmount",
      key: "fineAmount",
      render: (amount) => amount.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Ngày ghi nhận",
      dataIndex: "recordedDate",
      key: "recordedDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Người ghi nhận",
      dataIndex: "recordedBy",
      key: "recordedBy",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <Title level={3} className={styles.headerTitle}>
          Quản lý thành viên
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm thành viên mới
        </Button>
      </div>

      {/* Filter Section */}
      <Card className={styles.mainContent}>
        <div className={styles.filterContainer}>
          <Form layout="horizontal">
            <div className={styles.searchForm}>
              <Form.Item label="Tìm kiếm" className={styles.formItem}>
                <Input
                  placeholder="Tìm theo tên, mã thành viên, email..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={handleSearchChange}
                  allowClear
                />
              </Form.Item>

              <Form.Item label="Hạng thành viên" className={styles.formItem}>
                <Select
                  placeholder="Chọn hạng thành viên"
                  allowClear
                  value={filters.membershipType}
                  onChange={(value) =>
                    handleFilterChange("membershipType", value)
                  }
                >
                  <Option value="Vàng">Vàng</Option>
                  <Option value="Bạc">Bạc</Option>
                  <Option value="Đồng">Đồng</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Trạng thái" className={styles.formItem}>
                <Select
                  placeholder="Chọn trạng thái"
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                >
                  <Option value="Hoạt động">Hoạt động</Option>
                  <Option value="Tạm khóa">Tạm khóa</Option>
                  <Option value="Hết hạn">Hết hạn</Option>
                </Select>
              </Form.Item>

              <div className={styles.actionButtons}>
                <Button type="primary" icon={<FilterOutlined />}>
                  Lọc
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                  Đặt lại
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Tổng số thành viên"
                value={memberData.length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Thành viên vàng"
                value={
                  memberData.filter((m) => m.membershipType === "Vàng").length
                }
                prefix={<TrophyOutlined style={{ color: "#FFD700" }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Thành viên hoạt động"
                value={
                  memberData.filter((m) => m.status === "Hoạt động").length
                }
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statisticsCard}>
              <Statistic
                title="Thành viên có vi phạm"
                value={memberData.filter((m) => m.violations > 0).length}
                prefix={<WarningOutlined style={{ color: "#ff4d4f" }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Table Actions */}
        <div className={styles.tableActions}>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button icon={<ImportOutlined />}>Nhập Excel</Button>
          </Space>
        </div>

        {/* Members Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong ${total} thành viên`,
          }}
        />
      </Card>

      {/* Member Detail Modal */}
      <Modal
        title={
          editMode ? "Chỉnh sửa thông tin thành viên" : "Chi tiết thành viên"
        }
        visible={memberDetailVisible}
        onCancel={closeMemberDetail}
        width={800}
        footer={
          editMode
            ? [
                <Button key="cancel" onClick={() => setEditMode(false)}>
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Lưu thay đổi
                </Button>,
              ]
            : [
                <Button key="close" onClick={closeMemberDetail}>
                  Đóng
                </Button>,
                <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                >
                  Chỉnh sửa
                </Button>,
              ]
        }
      >
        {selectedMember &&
          (editMode ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{
                name: selectedMember.name,
                gender: selectedMember.gender,
                email: selectedMember.email,
                membershipType: selectedMember.membershipType,
                status: selectedMember.status,
                facultyDepartment: selectedMember.facultyDepartment,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="Nam">Nam</Radio>
                      <Radio value="Nữ">Nữ</Radio>
                      <Radio value="Khác">Khác</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="facultyDepartment" label="Khoa/Phòng ban">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="membershipType"
                    label="Hạng thành viên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn hạng thành viên!",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Vàng">Vàng</Option>
                      <Option value="Bạc">Bạc</Option>
                      <Option value="Đồng">Đồng</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái!" },
                    ]}
                  >
                    <Select>
                      <Option value="Hoạt động">Hoạt động</Option>
                      <Option value="Tạm khóa">Tạm khóa</Option>
                      <Option value="Hết hạn">Hết hạn</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <>
              <Row gutter={24}>
                <Col span={6}>
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    src={selectedMember.photo}
                    style={{ display: "block", margin: "0 auto 16px" }}
                  />
                  <div style={{ textAlign: "center" }}>
                    {renderMembershipBadge(selectedMember.membershipType)}
                  </div>
                </Col>
                <Col span={18}>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Mã thành viên</div>
                      <div className={styles.detailValue}>
                        <IdcardOutlined /> {selectedMember.id}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Họ và tên</div>
                      <div className={styles.detailValue}>
                        <UserOutlined /> {selectedMember.name}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Giới tính</div>
                      <div className={styles.detailValue}>
                        {selectedMember.gender}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Ngày sinh</div>
                      <div className={styles.detailValue}>
                        <CalendarOutlined />{" "}
                        {new Date(
                          selectedMember.dateOfBirth
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Email</div>
                      <div className={styles.detailValue}>
                        <MailOutlined /> {selectedMember.email}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Khoa/Phòng ban</div>
                      <div className={styles.detailValue}>
                        {selectedMember.facultyDepartment}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Điểm thành viên</div>
                      <div className={styles.detailValue}>
                        <TrophyOutlined /> {selectedMember.memberPoints} điểm
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Trạng thái</div>
                      <div className={styles.detailValue}>
                        {renderStatusBadge(selectedMember.status)}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>
                        Ngày tạo tài khoản
                      </div>
                      <div className={styles.detailValue}>
                        {new Date(selectedMember.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={styles.detailLabel}>Ngày hết hạn</div>
                      <div className={styles.detailValue}>
                        {new Date(selectedMember.expiryDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Divider />

              <Tabs defaultActiveKey="borrowing">
                <TabPane tab="Lịch sử mượn sách" key="borrowing">
                  <Table
                    columns={borrowingColumns}
                    dataSource={borrowingHistoryData}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </TabPane>

                <TabPane tab="Lịch sử sử dụng thư viện" key="usage">
                  <Table
                    columns={usageColumns}
                    dataSource={libraryUsageData}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </TabPane>

                <TabPane tab="Thành tích" key="achievements">
                  <Table
                    columns={achievementsColumns}
                    dataSource={achievementsData}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </TabPane>

                <TabPane tab="Vi phạm" key="violations">
                  {violationsData.length > 0 ? (
                    <Table
                      columns={violationsColumns}
                      dataSource={violationsData}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  ) : (
                    <Empty
                      description="Không có vi phạm"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      className={styles.emptyState}
                    />
                  )}
                </TabPane>
              </Tabs>
            </>
          ))}
      </Modal>
    </div>
  );
};

export default MemberManagement;
