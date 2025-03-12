import { useState } from "react";
import { Card, Input, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const roleColors = {
  "Thủ thư": "blue",
  "Nhân viên hỗ trợ": "green",
  "Quản lý danh mục": "purple",
};

const statusColors = {
  ACTIVE: "green",
  INACTIVE: "orange",
  BANNED: "red",
};

const employeeData = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    role: "Thủ thư",
    status: "ACTIVE",
  },
  {
    key: "2",
    name: "Trần Thị B",
    email: "b@example.com",
    role: "Nhân viên hỗ trợ",
    status: "INACTIVE",
  },
  {
    key: "3",
    name: "Lê Văn C",
    email: "c@example.com",
    role: "Quản lý danh mục",
    status: "BANNED",
  },
  {
    key: "4",
    name: "Phạm Thị D",
    email: "d@example.com",
    role: "Thủ thư",
    status: "ACTIVE",
  },
  {
    key: "5",
    name: "Hoàng Văn E",
    email: "e@example.com",
    role: "Nhân viên hỗ trợ",
    status: "INACTIVE",
  },
  {
    key: "6",
    name: "Đỗ Thị F",
    email: "f@example.com",
    role: "Quản lý danh mục",
    status: "BANNED",
  },
  {
    key: "7",
    name: "Bùi Văn G",
    email: "g@example.com",
    role: "Thủ thư",
    status: "ACTIVE",
  },
  {
    key: "8",
    name: "Vũ Thị H",
    email: "h@example.com",
    role: "Nhân viên hỗ trợ",
    status: "INACTIVE",
  },
];

const EmployeeManagement = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredData = employeeData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Họ Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  return (
    <Card title="Quản lý nhân viên" style={{ width: "100%" }}>
      <Search
        placeholder="Tìm kiếm nhân viên..."
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: "300px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/manage-staff/staff-detail`),
        })}
        rowClassName="clickable-row"
        style={{ cursor: "pointer" }}
      />
    </Card>
  );
};

export default EmployeeManagement;
