import { useState, useEffect } from "react";
import {
  Card,
  List,
  Tag,
  Typography,
  Skeleton,
  Empty,
  notification,
  Badge,
  Space,
  Avatar,
  Pagination,
} from "antd";
import {
  FileTextOutlined,
  MailOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import requestService from "/src/services/patron/requestService.js";

const { Title, Text } = Typography;

// Định nghĩa màu sắc tương ứng cho mỗi trạng thái
const statusColors = {
  "Đang chờ xử lý": "orange",
  "Đang xử lý": "blue",
  "Đã hoàn thành": "green",
  "Bị từ chối": "red",
};

// Hàm lấy biểu tượng cho loại yêu cầu
const getRequestTypeIcon = (type) => {
  switch (type) {
    case "Mượn/trả sách":
    case "Gia hạn sách":
    case "Đề xuất sách mới":
    case "Báo cáo sách hỏng":
      return "📚";
    case "Đặt chỗ phòng đọc":
    case "Báo cáo cơ sở vật chất/thiết bị":
      return "🏢";
    case "Lỗi hệ thống website/ứng dụng":
    case "Tài khoản và đăng nhập":
      return "💻";
    case "Cập nhật thông tin cá nhân":
      return "👤";
    case "Đề xuất sự kiện/hội thảo":
      return "🎯";
    case "Khiếu nại về phạt":
      return "⚠️";
    case "Hỗ trợ tìm tài liệu":
      return "🔍";
    case "Góp ý cải thiện dịch vụ":
      return "💡";
    case "Thắc mắc về điểm thành viên":
      return "🌟";
    default:
      return "📝";
  }
};

// Hàm định dạng ngày giờ
const formatDateTime = (dateString) => {
  const dateObj = new Date(dateString);
  return `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()} ${dateObj
    .getHours()
    .toString()
    .padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;
};

const ListRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequests();

      if (response.success) {
        setRequests(response.data || []);
        setTotalRequests(response.data?.length || 0);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách yêu cầu",
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (ticketID) => {
    navigate(`/user/request/${ticketID}`);
  };

  // Tính toán dữ liệu cho phân trang
  const paginatedRequests = requests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Tạo gradient background dựa trên trạng thái
  const getGradientByStatus = (status) => {
    switch (status) {
      case "Đang chờ xử lý":
        return "linear-gradient(135deg, #fff7e6 0%, #fff1cc 100%)";
      case "Đang xử lý":
        return "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)";
      case "Đã hoàn thành":
        return "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)";
      case "Bị từ chối":
        return "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)";
      default:
        return "linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)";
    }
  };

  return (
    <Card
      className="request-list-card"
      title={
        <Space>
          <MailOutlined style={{ fontSize: "18px" }} />
          <Title level={4} style={{ margin: 0 }}>
            Yêu cầu của bạn
          </Title>
        </Space>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        body: { padding: "12px 0" },
      }}
    >
      {loading ? (
        <div style={{ padding: "0 24px" }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              active
              avatar
              paragraph={{ rows: 2 }}
              style={{ marginBottom: "20px" }}
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Empty
          description="Bạn chưa gửi yêu cầu nào"
          style={{ margin: "40px 0" }}
        />
      ) : (
        <>
          <List
            dataSource={paginatedRequests}
            renderItem={(item) => (
              <List.Item
                key={item.ticketID}
                onClick={() => handleItemClick(item.ticketID)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: getGradientByStatus(item.status),
                  borderLeft: `4px solid ${
                    statusColors[item.status] || "#d9d9d9"
                  }`,
                  margin: "8px 16px",
                  borderRadius: "8px",
                  padding: "16px 24px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                }}
                className="request-item-hover"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "white",
                        color: "#597ef7",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {getRequestTypeIcon(item.problem)}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: "16px" }}>
                        {item.title}
                      </Text>
                      <Badge
                        count={
                          <Tag color={statusColors[item.status] || "default"}>
                            {item.status}
                          </Tag>
                        }
                        style={{ marginLeft: "8px" }}
                      />
                    </Space>
                  }
                  description={
                    <Space
                      direction="vertical"
                      size={2}
                      style={{ width: "100%" }}
                    >
                      <Space>
                        <FileTextOutlined />
                        <Text type="secondary">{item.problem}</Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                          {formatDateTime(item.createAt)}
                        </Text>
                      </Space>
                    </Space>
                  }
                />
                <RightOutlined style={{ color: "#8c8c8c" }} />
              </List.Item>
            )}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRequests}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <style>{`
        .request-item-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Card>
  );
};

export default ListRequest;
