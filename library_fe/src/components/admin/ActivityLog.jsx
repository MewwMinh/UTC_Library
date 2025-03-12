import { useState } from "react";
import { Card, Table, Tag, Select, DatePicker, Input } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const logData = [
  {
    key: "1",
    user: "Admin A",
    action: "Thêm tài liệu",
    type: "ADD",
    timestamp: "2025-02-24 10:00",
  },
  {
    key: "2",
    user: "Staff B",
    action: "Xóa tài khoản",
    type: "DELETE",
    timestamp: "2025-02-24 12:30",
  },
  {
    key: "3",
    user: "Admin C",
    action: "Phê duyệt tài liệu",
    type: "APPROVE",
    timestamp: "2025-02-23 15:45",
  },
  {
    key: "4",
    user: "Staff D",
    action: "Sửa thông tin sách",
    type: "EDIT",
    timestamp: "2025-02-22 09:15",
  },
];

const actionColors = {
  ADD: "green",
  DELETE: "red",
  EDIT: "blue",
  APPROVE: "purple",
};

const ActivityLog = () => {
  const [filteredLogs, setFilteredLogs] = useState(logData);
  const [searchText, setSearchText] = useState("");

  const handleFilter = (value) => {
    const filtered = logData.filter((log) =>
      value ? log.type === value : true
    );
    setFilteredLogs(filtered);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = logData.filter(
      (log) =>
        log.user.toLowerCase().includes(e.target.value.toLowerCase()) ||
        log.action.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const columns = [
    { title: "Người thực hiện", dataIndex: "user", key: "user" },
    { title: "Hành động", dataIndex: "action", key: "action" },
    {
      title: "Loại hành động",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={actionColors[type]}>{type}</Tag>,
    },
    { title: "Thời gian", dataIndex: "timestamp", key: "timestamp" },
  ];

  return (
    <Card title="Nhật ký Hoạt động" style={{ width: "100%" }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <RangePicker
          onChange={(dates) => {
            const filtered = logData.filter((log) =>
              dates
                ? moment(log.timestamp).isBetween(
                    dates[0],
                    dates[1],
                    null,
                    "[]"
                  )
                : true
            );
            setFilteredLogs(filtered);
          }}
        />
        <Select placeholder="Loại hành động" onChange={handleFilter} allowClear>
          <Option value="ADD">Thêm</Option>
          <Option value="DELETE">Xóa</Option>
          <Option value="EDIT">Sửa</Option>
          <Option value="APPROVE">Phê duyệt</Option>
        </Select>
        <Input
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredLogs}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default ActivityLog;
