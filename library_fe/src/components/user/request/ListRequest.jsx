import { Card, Table, Tag, Pagination, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const requestTypes = {
  ACCOUNT_ISSUE: "Account Issue",
  BORROWING_ISSUE: "Borrowing Issue",
  TECHNICAL_ISSUE: "Technical Issue",
  OTHER: "Other",
};

const statusColors = {
  PENDING: "orange",
  IN_PROGRESS: "blue",
  RESOLVED: "green",
  REJECTED: "red",
};

const initialRequests = [
  {
    id: 1,
    title: "Login Issue",
    name: "User A",
    type: "ACCOUNT_ISSUE",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Lost Book",
    name: "User B",
    type: "BORROWING_ISSUE",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    title: "Website Bug",
    name: "User C",
    type: "TECHNICAL_ISSUE",
    status: "RESOLVED",
  },
  {
    id: 4,
    title: "General Inquiry",
    name: "User D",
    type: "OTHER",
    status: "REJECTED",
  },
  {
    id: 5,
    title: "Password Reset",
    name: "User E",
    type: "ACCOUNT_ISSUE",
    status: "PENDING",
  },
];

const ListRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(initialRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const columns = [
    { title: "Mã Yêu Cầu", dataIndex: "id", key: "id" },
    { title: "Tiêu Đề", dataIndex: "title", key: "title" },
    { title: "Họ Tên", dataIndex: "name", key: "name" },
    {
      title: "Loại Yêu Cầu",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag>{requestTypes[type]}</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  const paginatedRequests = requests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={
        <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
          Danh sách các góp ý & yêu cầu
        </Typography.Title>
      }
      style={{
        marginBottom: 20,
        background:
          "url('https://www.transparenttextures.com/patterns/ravenna.png'), linear-gradient(135deg, #F9F9F9 0%, #E5E5E5 100%)",
      }}
    >
      {requests.length === 0 ? (
        <p>Bạn chưa gửi đi yêu cầu nào</p>
      ) : (
        <>
          <Table
            dataSource={paginatedRequests}
            columns={columns}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => navigate(`/user/request/details`),
              style: { cursor: "pointer" },
            })}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={requests.length}
            onChange={setCurrentPage}
            style={{ marginTop: "10px", textAlign: "center" }}
          />
        </>
      )}
    </Card>
  );
};

export default ListRequest;
