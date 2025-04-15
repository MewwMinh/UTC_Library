// src/components/patron/PatronList.jsx
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Tooltip,
  notification,
  Select,
  Card,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import patronService from "/src/services/coordinator/patronService.js";
import styles from "/src/styles/members/PatronList.module.css";
import AddPatronModal from "./AddPatronModal"; // Import modal component

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const getMembershipColor = (type) => {
  switch (type) {
    case "Vàng":
      return "gold";
    case "Bạc":
      return "silver";
    case "Đồng":
      return "#cd7f32";
    default:
      return "default";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Hoạt động":
      return "success";
    case "Tạm khóa":
      return "warning";
    case "Bị khóa":
      return "error";
    default:
      return "default";
  }
};

const PatronList = () => {
  const navigate = useNavigate();
  const [patrons, setPatrons] = useState([]);
  const [filteredPatrons, setFilteredPatrons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    membershipType: null,
    status: null,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchPatrons();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patrons, searchText, filters]);

  const fetchPatrons = async () => {
    try {
      setLoading(true);
      const response = await patronService.getAllPatrons();

      if (response.success) {
        setPatrons(response.data);
        setFilteredPatrons(response.data);
        setPagination((prev) => ({ ...prev, total: response.data.length }));
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách bạn đọc",
        });
      }
    } catch (error) {
      console.error("Error fetching patrons:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Functions for modal
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const hideAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = () => {
    fetchPatrons(); // Reload the list after successful addition
  };

  const applyFilters = () => {
    let result = [...patrons];

    // Áp dụng tìm kiếm
    if (searchText) {
      result = result.filter(
        (patron) =>
          patron.patronName.toLowerCase().includes(searchText.toLowerCase()) ||
          patron.patronID.toLowerCase().includes(searchText.toLowerCase()) ||
          patron.patronEmail.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Áp dụng lọc hạng thành viên
    if (filters.membershipType) {
      result = result.filter(
        (patron) => patron.membershipType === filters.membershipType
      );
    }

    // Áp dụng lọc trạng thái
    if (filters.status) {
      result = result.filter(
        (patron) => patron.patronStatus === filters.status
      );
    }

    setFilteredPatrons(result);
    setPagination((prev) => ({ ...prev, total: result.length, current: 1 }));
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleMembershipFilter = (value) => {
    setFilters((prev) => ({ ...prev, membershipType: value }));
  };

  const handleStatusFilter = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const resetFilters = () => {
    setSearchText("");
    setFilters({ membershipType: null, status: null });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "Bạn đọc",
      dataIndex: "patronName",
      key: "patronName",
      width: "25%",
      sorter: (a, b) => a.patronName.localeCompare(b.patronName),
      render: (text, record) => (
        <div className={styles.patronName}>
          <Avatar
            src={record.patronImage}
            icon={!record.patronImage && <UserOutlined />}
            size="large"
            className={styles.patronAvatar}
          />
          <div className={styles.nameDetails}>
            <Text strong>{text}</Text>
            <Text type="secondary">{record.patronID}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "patronEmail",
      key: "patronEmail",
      width: "25%",
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: "Hạng thành viên",
      dataIndex: "membershipType",
      key: "membershipType",
      render: (type) => (
        <Tag color={getMembershipColor(type)} className={styles.membershipTag}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Điểm thành viên",
      dataIndex: "memberPoints",
      key: "memberPoints",
      sorter: (a, b) => a.memberPoints - b.memberPoints,
    },
    {
      title: "Trạng thái",
      dataIndex: "patronStatus",
      key: "patronStatus",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra dòng
              navigate(`/staff/patron-info/${record.patronID}`);
            }}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.patronListContainer}>
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={12} lg={10} xl={10}>
            <Search
              placeholder="Tìm theo tên, mã, email..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className={styles.searchInput}
            />
          </Col>
          <Col xs={12} sm={8} md={5} lg={4} xl={3}>
            <Select
              placeholder="Hạng thành viên"
              allowClear
              style={{ width: "100%" }}
              onChange={handleMembershipFilter}
              value={filters.membershipType}
              className={styles.filterSelect}
            >
              <Option value="Vàng">Vàng</Option>
              <Option value="Bạc">Bạc</Option>
              <Option value="Đồng">Đồng</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={5} lg={4} xl={3}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={handleStatusFilter}
              value={filters.status}
              className={styles.filterSelect}
            >
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Tạm khóa">Tạm khóa</Option>
              <Option value="Bị khóa">Bị khóa</Option>
            </Select>
          </Col>
          <Col
            xs={24}
            sm={8}
            md={2}
            lg={6}
            xl={8}
            className={styles.actionButtons}
          >
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPatrons}
              className={styles.actionButton}
            >
              Làm mới
            </Button>
            <Button onClick={resetFilters} className={styles.actionButton}>
              Đặt lại bộ lọc
            </Button>
            {/* Thêm nút "Thêm bạn đọc" */}
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={showAddModal}
              className={styles.addButton}
            >
              Thêm bạn đọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredPatrons}
        rowKey="patronID"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        className={styles.patronTable}
        onRow={(record) => ({
          onClick: () => navigate(`/staff/patron-info/${record.patronID}`),
          className: styles.clickableRow,
        })}
      />

      {/* Add the modal component */}
      <AddPatronModal
        visible={isAddModalVisible}
        onClose={hideAddModal}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default PatronList;
