import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Skeleton,
  Typography,
  Divider,
  Alert,
  Space,
  Badge,
  Timeline,
  Empty,
  Button,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UserOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import requestService from "/src/services/patron/requestService.js";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const statusConfig = {
  "Đang chờ xử lý": {
    color: "orange",
    icon: <ClockCircleOutlined />,
    text: "Đang chờ xử lý",
  },
  "Đang xử lý": {
    color: "blue",
    icon: <SyncOutlined spin />,
    text: "Đang xử lý",
  },
  "Đã hoàn thành": {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Đã hoàn thành",
  },
  "Bị từ chối": {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Bị từ chối",
  },
};

const RequestDetail = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch request details
        const requestResponse = await requestService.getRequestDetail(
          requestId
        );
        if (requestResponse.success) {
          setRequest(requestResponse.data);
        } else {
          setError(
            requestResponse.message || "Không thể tải thông tin yêu cầu"
          );
          return;
        }

        // Fetch request responses
        const responsesResponse = await requestService.getRequestResponses(
          requestId
        );
        if (responsesResponse.success) {
          setResponses(responsesResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching request data:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestData();
    }
  }, [requestId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusDisplay = (status) => {
    const config = statusConfig[status] || {
      color: "default",
      icon: <ClockCircleOutlined />,
      text: status,
    };

    return (
      <Space>
        <Badge status={config.color} />
        {config.icon}
        <Text>{config.text}</Text>
      </Space>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button type="primary" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  if (!request) {
    return (
      <Empty
        description="Không tìm thấy thông tin yêu cầu"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleGoBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            marginTop: "-24px",
            marginLeft: "-24px",
            marginRight: "-24px",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
            color: "white",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Space align="center">
            <FileDoneOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0, color: "white" }}>
              Yêu cầu #{request.ticketID || requestId}
            </Title>
          </Space>
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "24px",
            }}
          >
            <Tag color={statusConfig[request.status]?.color || "default"}>
              {getStatusDisplay(request.status)}
            </Tag>
          </div>
        </div>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={5}>
              <FileTextOutlined /> Thông tin yêu cầu
            </Title>
            <div
              style={{
                padding: "16px",
                background: "rgba(0, 0, 0, 0.02)",
                borderRadius: "8px",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Tiêu đề:</Text>
                  <Paragraph style={{ marginTop: 4, fontSize: 16 }}>
                    {request.title || request.problem}
                  </Paragraph>
                </div>

                <div>
                  <Text strong>Loại yêu cầu:</Text>
                  <Paragraph style={{ marginTop: 4 }}>
                    <Tag color="blue">{request.problem || request.type}</Tag>
                  </Paragraph>
                </div>

                <div>
                  <Text strong>Thời gian tạo:</Text>
                  <Paragraph style={{ marginTop: 4 }}>
                    {formatDate(request.createdAt)}
                  </Paragraph>
                </div>

                <div>
                  <Text strong>Chi tiết yêu cầu:</Text>
                  <Paragraph
                    style={{
                      marginTop: 8,
                      padding: "12px",
                      background: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                    }}
                  >
                    {request.description || request.detail}
                  </Paragraph>
                </div>
              </Space>
            </div>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Title level={5}>
              <MessageOutlined /> Phản hồi
            </Title>

            {responses && responses.length > 0 ? (
              <Timeline
                items={responses.map((response, index) => ({
                  color: "blue",
                  children: (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        marginBottom: 16,
                        borderRadius: 8,
                        background: "#f9f9f9",
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {formatDate(response.createAt)}
                          </Text>
                        </div>
                        <div>
                          <Text strong>Nhân viên:</Text>{" "}
                          {response.staffName || "N/A"}
                        </div>
                        {response.title && (
                          <div>
                            <Text strong>Tiêu đề:</Text> {response.title}
                          </div>
                        )}
                        <Paragraph
                          style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            background: "#fff",
                            border: "1px solid #f0f0f0",
                            borderRadius: "4px",
                          }}
                        >
                          {response.description}
                        </Paragraph>
                      </Space>
                    </Card>
                  ),
                }))}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có phản hồi"
                style={{ margin: "24px 0" }}
              />
            )}
          </div>
        </Space>
      </Card>
    </motion.div>
  );
};

export default RequestDetail;
