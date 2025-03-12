import { useState, useEffect } from "react";
import { Card, Table, Button, Tag } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function ListPatron() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data
  useEffect(() => {
    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      const mockData = [
        {
          id: "2025UTC0001",
          name: "Nguyễn Văn A",
          gender: "Nam",
          birthDate: "1998-05-12",
          email: "nguyenvana@gmail.com",
          memberRank: "Vàng",
          status: "Hoạt động",
        },
        {
          id: "2025UTC0002",
          name: "Trần Thị B",
          gender: "Nữ",
          birthDate: "1999-03-25",
          email: "tranthib@gmail.com",
          memberRank: "Bạc",
          status: "Hoạt động",
        },
        {
          id: "2024UTC0150",
          name: "Lê Văn C",
          gender: "Nam",
          birthDate: "2000-11-08",
          email: "levanc@gmail.com",
          memberRank: "Đồng",
          status: "Hoạt động",
        },
        {
          id: "SV20250001",
          name: "Phạm Thị D",
          gender: "Nữ",
          birthDate: "2001-07-19",
          email: "phamthid@gmail.com",
          memberRank: "Vàng",
          status: "Hoạt động",
        },
        {
          id: "SV20250125",
          name: "Hoàng Văn E",
          gender: "Nam",
          birthDate: "2002-01-30",
          email: "hoangvane@gmail.com",
          memberRank: "Đồng",
          status: "Khóa",
        },
      ];

      setReaders(mockData);
      setLoading(false);
    }, 2000);
  }, []);

  // Handle view reader details
  const handleViewReader = (record) => {
    // Giả sử chuyển đến trang chi tiết bạn đọc
    navigate(`/staff/aa`);
    console.log("Xem chi tiết bạn đọc:", record);
  };

  // Table columns
  const columns = [
    {
      title: "MSV / Mã bạn đọc",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      width: 120,
      render: (text) => {
        const date = dayjs(text);
        return date.format("DD/MM/YYYY");
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Hạng thành viên",
      dataIndex: "memberRank",
      key: "memberRank",
      width: 150,
      render: (rank) => {
        let color = "blue";
        if (rank === "Vàng") {
          color = "gold";
        } else if (rank === "Bạc") {
          color = "silver";
        } else if (rank === "Đồng") {
          color = "orange";
        }
        return <Tag color={color}>{rank}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "green";
        if (status === "Khóa") {
          color = "red";
        } else if (status === "Tạm khóa") {
          color = "orange";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={() => handleViewReader(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];
  return (
    <Card title="Danh sách bạn đọc">
      <Table
        columns={columns}
        dataSource={readers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}
export default ListPatron;
