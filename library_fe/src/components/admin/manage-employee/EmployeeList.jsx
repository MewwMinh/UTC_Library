import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Avatar,
  Tag,
  Row,
  Col,
  Card,
} from "antd";
import { UserOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import employeeService from "/src/services/manager/employeeService.js";
import styles from "/src/styles/manager/manage-employee/EmployeeList.module.css";

const { Option } = Select;
const { Search } = Input;

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    role: "",
    status: "",
  });

  // Fetch employees data
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllEmployees();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        console.error("Error fetching employees:", response.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle filter changes
  const handleFilterChange = (value, filterName) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setFilters({
      gender: "",
      role: "",
      status: "",
    });
  };

  // Navigate to employee details
  const viewEmployeeDetails = (employeeId) => {
    navigate(`/manager/employees/employee-details/${employeeId}`);
  };

  // Filter the employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    // Search by ID or name
    const matchesSearch =
      !searchText ||
      employee.userID.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.userName.toLowerCase().includes(searchText.toLowerCase());

    // Apply filters
    const matchesGender = !filters.gender || employee.gender === filters.gender;
    const matchesRole = !filters.role || employee.role === filters.role;
    const matchesStatus = !filters.status || employee.status === filters.status;

    return matchesSearch && matchesGender && matchesRole && matchesStatus;
  });

  // Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case "MANAGER":
        return { text: "Quản lý", color: "red" };
      case "LIBRARIAN":
        return { text: "Thủ thư", color: "blue" };
      case "COORDINATOR":
        return { text: "Nhân viên phòng đọc", color: "green" };
      default:
        return { text: role, color: "default" };
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    if (status === "Hoạt động") {
      return <Tag color="success">Hoạt động</Tag>;
    } else {
      return <Tag color="error">Không hoạt động</Tag>;
    }
  };

  // Table columns
  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "userID",
      key: "userID",
      width: 150,
    },
    {
      title: "Nhân viên",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => (
        <div className={styles.employeeInfo}>
          <Avatar
            src={record.userImage}
            size={40}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <div>
            <div className={styles.employeeName}>{record.userName}</div>
            <div className={styles.employeeEmail}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (role) => {
        const roleInfo = getRoleDisplay(role);
        return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => getStatusDisplay(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => viewEmployeeDetails(record.userID)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title={
          <span style={{ marginLeft: 10 }}>Danh sách nhân viên thư viện</span>
        }
        extra={
          <Button
            onClick={() => navigate("/manager/employees/create-employee")}
            style={{
              marginRight: 10,
              backgroundColor: "blueviolet",
              color: "white",
            }}
          >
            Tạo nhân viên mới
          </Button>
        }
        className={styles.card}
      >
        <div className={styles.filterSection}>
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div className={styles.filterItem}>
                <label>Tìm kiếm:</label>
                <Search
                  placeholder="Tìm theo mã hoặc tên nhân viên"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                  className={styles.searchInput}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={4} lg={4}>
              <div className={styles.filterItem}>
                <label>Giới tính:</label>
                <Select
                  placeholder="Tất cả giới tính"
                  value={filters.gender}
                  onChange={(value) => handleFilterChange(value, "gender")}
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <div className={styles.filterItem}>
                <label>Vai trò:</label>
                <Select
                  placeholder="Tất cả vai trò"
                  value={filters.role}
                  onChange={(value) => handleFilterChange(value, "role")}
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="MANAGER">Quản lý</Option>
                  <Option value="LIBRARIAN">Thủ thư</Option>
                  <Option value="COORDINATOR">Nhân viên phòng đọc</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <div className={styles.filterItem}>
                <label>Trạng thái:</label>
                <Select
                  placeholder="Tất cả trạng thái"
                  value={filters.status}
                  onChange={(value) => handleFilterChange(value, "status")}
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="Hoạt động">Hoạt động</Option>
                  <Option value="Không hoạt động">Không hoạt động</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={resetFilters}
                className={styles.resetButton}
              >
                Đặt lại bộ lọc
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="userID"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong ${total} nhân viên`,
          }}
          className={styles.table}
          onRow={(record) => ({
            onClick: () => viewEmployeeDetails(record.userID),
          })}
        />
      </Card>
    </div>
  );
};

export default EmployeeList;
