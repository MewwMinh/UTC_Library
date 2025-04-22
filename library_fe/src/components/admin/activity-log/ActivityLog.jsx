import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Input,
  DatePicker,
  Select,
  Space,
  Button,
  Tag,
  Modal,
  Avatar,
  Tooltip,
  Row,
  Col,
  Spin,
  notification,
  Divider,
  Empty,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  ExportOutlined,
  CalendarOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import * as XLSX from "xlsx";
import activityLogService from "/src/services/manager/activityLogService.js";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ActivityLog = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [allActivityLogs, setAllActivityLogs] = useState([]); // Lưu tất cả dữ liệu gốc
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });
  const [filters, setFilters] = useState({
    actionType: "",
    entityType: "",
    startDate: null,
    endDate: null,
    searchText: "",
    status: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [, setStatistics] = useState({
    totalLogs: 0,
    actionTypeCount: {},
    entityTypeCount: {},
    statusCount: {},
  });

  // Danh sách các loại hành động
  const actionTypes = [
    "Tất cả",
    "Thêm mới",
    "Cập nhật",
    "Xóa",
    "Đăng nhập",
    "Đăng xuất",
    "Xác nhận",
    "Từ chối",
    "Gia hạn",
    "Khôi phục",
  ];

  // Danh sách các loại đối tượng
  const entityTypes = [
    "Tất cả",
    "Staff",
    "Book",
    "Patron",
    "Event",
    "Request",
    "Reservation",
    "Setting",
    "Role",
    "Achievement",
  ];

  // Danh sách trạng thái
  const statusList = [
    "Tất cả",
    "Thành công",
    "Thất bại",
    "Đang xử lý",
    "Chờ xử lý",
  ];

  // Mapping màu trạng thái
  const statusColors = {
    "Thành công": "success",
    "Thất bại": "error",
    "Đang xử lý": "processing",
    "Chờ xử lý": "warning",
  };

  // Màu cho loại hành động
  const actionTypeColors = {
    "Thêm mới": "success",
    Xóa: "error",
    "Cập nhật": "processing",
    "Đăng nhập": "warning",
    "Đăng xuất": "default",
    "Xác nhận": "cyan",
    "Từ chối": "orange",
    "Gia hạn": "purple",
    "Khôi phục": "blue",
  };

  // Hàm lấy tất cả dữ liệu từ API (không có lọc)
  const fetchData = async () => {
    try {
      setLoading(true);

      // Gọi API không có tham số lọc
      const response = await activityLogService.getActivityLogs();

      if (response.success) {
        // Lưu tất cả dữ liệu gốc
        setAllActivityLogs(response.data || []);

        // Tính toán thống kê từ toàn bộ dữ liệu
        calculateStatistics(response.data || []);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải nhật ký hoạt động",
        });
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê cơ bản từ dữ liệu
  const calculateStatistics = (data) => {
    const actionTypeCount = {};
    const entityTypeCount = {};
    const statusCount = {};

    data.forEach((log) => {
      // Đếm theo loại hành động
      if (log.actionType) {
        actionTypeCount[log.actionType] =
          (actionTypeCount[log.actionType] || 0) + 1;
      }

      // Đếm theo loại đối tượng
      if (log.entityType) {
        entityTypeCount[log.entityType] =
          (entityTypeCount[log.entityType] || 0) + 1;
      }

      // Đếm theo trạng thái
      if (log.status) {
        statusCount[log.status] = (statusCount[log.status] || 0) + 1;
      }
    });

    setStatistics({
      totalLogs: data.length,
      actionTypeCount,
      entityTypeCount,
      statusCount,
    });
  };

  // Gọi API lần đầu khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thay đổi phân trang
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
  };

  // Xử lý khi thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
    // Reset về trang 1 khi thay đổi filter
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý khi thay đổi khoảng thời gian
  const handleDateRangeChange = (dates) => {
    // Đảm bảo rằng dates được chuyển đổi sang đối tượng dayjs
    const startDate = dates && dates[0] ? dayjs(dates[0]) : null;
    const endDate = dates && dates[1] ? dayjs(dates[1]) : null;

    setFilters({
      ...filters,
      startDate: startDate,
      endDate: endDate,
    });

    // Reset về trang 1 khi thay đổi filter
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setFilters({
      ...filters,
      searchText: value,
    });
    // Reset về trang 1 khi tìm kiếm
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý khi nhấn vào xem chi tiết
  const handleViewDetails = (record) => {
    setCurrentLog(record);
    setModalVisible(true);
  };

  // Hàm reset tất cả filter
  const handleResetFilters = () => {
    setFilters({
      actionType: "",
      entityType: "",
      startDate: null,
      endDate: null,
      searchText: "",
      status: "",
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Hàm xuất Excel
  const exportToExcel = async () => {
    try {
      setExportLoading(true);

      // Hiển thị thông báo đang xử lý
      notification.info({
        message: "Đang chuẩn bị dữ liệu",
        description: "Vui lòng đợi trong giây lát...",
        duration: 2,
      });

      // Sử dụng dữ liệu đã lọc để xuất ra Excel
      const dataToExport = filteredLogs;

      // Định dạng dữ liệu cho Excel
      const exportData = dataToExport.map((log) => ({
        "Người thực hiện": log.userName || "N/A",
        "Vai trò": log.userRole || "N/A",
        "Hành động": log.actionType || "N/A",
        "Đối tượng": log.entityType || "N/A",
        "Mã đối tượng": log.entityID || "N/A",
        "Chi tiết": log.actionDetails || "N/A",
        "Thời gian": log.actionTime
          ? dayjs(log.actionTime).format("DD/MM/YYYY HH:mm:ss")
          : "N/A",
        "Trạng thái": log.status || "N/A",
      }));

      // Tạo một sheet title với thông tin về báo cáo
      const title = [
        ["BÁO CÁO NHẬT KÝ HOẠT ĐỘNG"],
        ["Thời gian xuất báo cáo:", dayjs().format("DD/MM/YYYY HH:mm:ss")],
        ["Người xuất báo cáo:", "Admin"], // Có thể thay bằng tên người dùng thực tế
        ["Tổng số bản ghi:", exportData.length.toString()],
        ["Bộ lọc áp dụng:"],
        ["Loại hành động:", filters.actionType || "Tất cả"],
        ["Loại đối tượng:", filters.entityType || "Tất cả"],
        ["Trạng thái:", filters.status || "Tất cả"],
        [
          "Từ ngày:",
          filters.startDate
            ? typeof filters.startDate.format === "function"
              ? filters.startDate.format("DD/MM/YYYY")
              : dayjs(filters.startDate).format("DD/MM/YYYY")
            : "N/A",
        ],
        [
          "Đến ngày:",
          filters.endDate
            ? typeof filters.endDate.format === "function"
              ? filters.endDate.format("DD/MM/YYYY")
              : dayjs(filters.endDate).format("DD/MM/YYYY")
            : "N/A",
        ],
        ["Từ khóa tìm kiếm:", filters.searchText || "N/A"],
        [""], // Dòng trống
      ];

      // Tạo workbook và worksheet
      const workbook = XLSX.utils.book_new();

      // Tạo worksheet thông tin
      const titleWorksheet = XLSX.utils.aoa_to_sheet(title);
      XLSX.utils.book_append_sheet(
        workbook,
        titleWorksheet,
        "Thông tin báo cáo"
      );

      // Tạo worksheet dữ liệu chính
      const dataWorksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(
        workbook,
        dataWorksheet,
        "Nhật ký hoạt động"
      );

      // Điều chỉnh độ rộng cột cho worksheet dữ liệu
      const columnsWidth = [
        { wch: 20 }, // Người thực hiện
        { wch: 15 }, // Vai trò
        { wch: 15 }, // Hành động
        { wch: 15 }, // Đối tượng
        { wch: 20 }, // Mã đối tượng
        { wch: 50 }, // Chi tiết
        { wch: 20 }, // Thời gian
        { wch: 15 }, // Trạng thái
      ];

      dataWorksheet["!cols"] = columnsWidth;

      // Xuất file
      const fileNameSuffix = filters.actionType ? `_${filters.actionType}` : "";
      const fileNamePrefix =
        filters.entityType && filters.entityType !== "Tất cả"
          ? `${filters.entityType}_`
          : "";
      const fileName = `${fileNamePrefix}Nhat_ky_hoat_dong${fileNameSuffix}_${dayjs().format(
        "DD_MM_YYYY"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      notification.success({
        message: "Xuất Excel thành công",
        description: `Đã xuất ${exportData.length} bản ghi`,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      notification.error({
        message: "Lỗi xuất Excel",
        description: "Không thể xuất dữ liệu sang Excel: " + error.message,
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Lọc dữ liệu theo tất cả các điều kiện trên frontend
  const filteredLogs = allActivityLogs.filter((log) => {
    // Lọc theo loại hành động
    if (
      filters.actionType &&
      filters.actionType !== "Tất cả" &&
      log.actionType !== filters.actionType
    ) {
      return false;
    }

    // Lọc theo loại đối tượng
    if (
      filters.entityType &&
      filters.entityType !== "Tất cả" &&
      log.entityType !== filters.entityType
    ) {
      return false;
    }

    // Lọc theo trạng thái
    if (
      filters.status &&
      filters.status !== "Tất cả" &&
      log.status !== filters.status
    ) {
      return false;
    }

    // Lọc theo khoảng thời gian
    if (filters.startDate && filters.endDate) {
      const logDate = dayjs(log.actionTime);
      // Chuyển đổi startDate và endDate sang thời điểm đầu ngày và cuối ngày
      const startOfDay = filters.startDate.startOf("day");
      const endOfDay = filters.endDate.endOf("day");

      if (!logDate.isAfter(startOfDay) || !logDate.isBefore(endOfDay)) {
        return false;
      }
    }

    // Lọc theo từ khóa tìm kiếm
    if (filters.searchText) {
      const searchTextLower = filters.searchText.toLowerCase();
      const matchesSearch =
        (log.userName?.toLowerCase() || "").includes(searchTextLower) ||
        (log.actionDetails?.toLowerCase() || "").includes(searchTextLower) ||
        (log.entityType?.toLowerCase() || "").includes(searchTextLower) ||
        (log.entityID?.toLowerCase() || "").includes(searchTextLower) ||
        (log.userRole?.toLowerCase() || "").includes(searchTextLower) ||
        (log.status?.toLowerCase() || "").includes(searchTextLower) ||
        dayjs(log.actionTime)
          .format("DD/MM/YYYY HH:mm:ss")
          .toLowerCase()
          .includes(searchTextLower);

      if (!matchesSearch) {
        return false;
      }
    }

    // Nếu qua tất cả các lọc thì trả về true
    return true;
  });

  // Tính toán dữ liệu cho phân trang hiện tại
  const getCurrentPageData = () => {
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredLogs.slice(startIndex, endIndex);
  };

  // Cập nhật số trang dựa trên dữ liệu đã lọc
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredLogs.length,
    }));
  }, [filteredLogs.length]);

  // Tính toán số bản ghi cho ngày hôm nay
  const getTodayLogsCount = () => {
    const today = dayjs().startOf("day");
    return filteredLogs.filter((log) => dayjs(log.actionTime).isAfter(today))
      .length;
  };

  // Cấu hình các cột trong bảng
  const columns = [
    {
      title: "Người thực hiện",
      dataIndex: "userName",
      key: "userName",
      width: 180,
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.userImage}
            icon={!record.userImage && <UserOutlined />}
            size="small"
          />
          <div>
            <Text strong>{text || "N/A"}</Text>
            <div>
              <Tag color="blue">{record.userRole || "N/A"}</Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actionType",
      key: "actionType",
      width: 120,
      render: (text) => {
        if (!text) return <Tag color="default">N/A</Tag>;

        return <Tag color={actionTypeColors[text] || "default"}>{text}</Tag>;
      },
    },
    {
      title: "Đối tượng",
      dataIndex: "entityType",
      key: "entityType",
      width: 120,
      render: (text, record) => (
        <Tooltip title={record.entityID ? `ID: ${record.entityID}` : ""}>
          <Tag color="purple">{text || "N/A"}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Chi tiết",
      dataIndex: "actionDetails",
      key: "actionDetails",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text || "Không có chi tiết"}>
          <Paragraph
            ellipsis={{ rows: 1 }}
            style={{ marginBottom: 0, cursor: "pointer" }}
          >
            {text || "Không có chi tiết"}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "actionTime",
      key: "actionTime",
      width: 170,
      render: (text) => {
        if (!text) return "N/A";
        return (
          <Tooltip title={dayjs(text).format("DD/MM/YYYY HH:mm:ss")}>
            <Space>
              <CalendarOutlined />
              {dayjs(text).format("DD/MM/YYYY HH:mm")}
            </Space>
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => {
        if (!text) return <Tag color="default">N/A</Tag>;

        return <Tag color={statusColors[text] || "default"}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(record);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Lấy dữ liệu cho trang hiện tại
  const currentPageData = getCurrentPageData();

  return (
    <div>
      <Card
        title={
          <Space style={{ marginLeft: 15 }}>
            <FileTextOutlined />
            <Title level={4} style={{ margin: 0 }}>
              Nhật ký hoạt động
            </Title>
          </Space>
        }
        extra={
          <Space style={{ marginRight: 15 }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              Làm mới
            </Button>

            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={exportToExcel}
              loading={exportLoading}
              disabled={filteredLogs.length === 0}
            >
              Xuất Excel
            </Button>
          </Space>
        }
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Phần Filter và Search */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Input.Search
              placeholder="Tìm kiếm theo tên, chi tiết, đối tượng..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Loại hành động"
              style={{ width: "100%" }}
              allowClear
              value={filters.actionType}
              onChange={(value) => handleFilterChange("actionType", value)}
            >
              {actionTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Loại đối tượng"
              style={{ width: "100%" }}
              allowClear
              value={filters.entityType}
              onChange={(value) => handleFilterChange("entityType", value)}
            >
              {entityTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
            >
              {statusList.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={9} lg={6}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
              value={[filters.startDate, filters.endDate]}
              onChange={handleDateRangeChange}
              allowClear
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={handleResetFilters}
                disabled={
                  !filters.actionType &&
                  !filters.entityType &&
                  !filters.startDate &&
                  !filters.endDate &&
                  !filters.searchText &&
                  !filters.status
                }
              >
                Đặt lại bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Hiển thị thống kê ngắn gọn */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={8} lg={6}>
            <Card size="small">
              <Statistic
                title="Tổng số bản ghi"
                value={filteredLogs.length}
                suffix={<InfoCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={6}>
            <Card size="small">
              <Statistic
                title="Thành công"
                value={
                  filteredLogs.filter((log) => log.status === "Thành công")
                    .length
                }
                valueStyle={{ color: "#3f8600" }}
                suffix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={6}>
            <Card size="small">
              <Statistic
                title="Thất bại"
                value={
                  filteredLogs.filter((log) => log.status === "Thất bại").length
                }
                valueStyle={{ color: "#cf1322" }}
                suffix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={6}>
            <Card size="small">
              <Statistic
                title="Hôm nay"
                value={getTodayLogsCount()}
                suffix={<HistoryOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Bảng dữ liệu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Table
            columns={columns}
            dataSource={currentPageData}
            rowKey={(record) =>
              record.logID || Math.random().toString(36).substring(2)
            }
            pagination={{
              ...pagination,
              total: filteredLogs.length,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} bản ghi`,
            }}
            onChange={handleTableChange}
            loading={loading}
            size="middle"
            scroll={{ x: 1100 }}
            onRow={(record) => ({
              onClick: () => handleViewDetails(record),
              style: { cursor: "pointer" },
            })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có dữ liệu"
                />
              ),
            }}
          />
        </motion.div>
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>Chi tiết nhật ký hoạt động</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {currentLog ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  size="small"
                  style={{
                    marginBottom: 16,
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  }}
                >
                  <Row gutter={[16, 8]}>
                    <Col span={4}>
                      <Avatar
                        src={currentLog.userImage}
                        icon={!currentLog.userImage && <UserOutlined />}
                        size={64}
                        style={{
                          border: "2px solid #fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Col>
                    <Col span={20}>
                      <Title level={5} style={{ marginBottom: 4 }}>
                        {currentLog.userName || "N/A"}
                      </Title>
                      <Tag color="blue">{currentLog.userRole || "N/A"}</Tag>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          <CalendarOutlined />{" "}
                          {dayjs(currentLog.actionTime).format(
                            "DD/MM/YYYY HH:mm:ss"
                          ) || "N/A"}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={12}>
                <Text strong>Loại hành động:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag
                    color={
                      currentLog.actionType === "Thêm mới"
                        ? "success"
                        : currentLog.actionType === "Xóa"
                        ? "error"
                        : currentLog.actionType === "Cập nhật"
                        ? "processing"
                        : "default"
                    }
                  >
                    {currentLog.actionType || "N/A"}
                  </Tag>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>Trạng thái:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color={statusColors[currentLog.status] || "default"}>
                    {currentLog.status || "N/A"}
                  </Tag>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>Đối tượng:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="purple">{currentLog.entityType || "N/A"}</Tag>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>Mã đối tượng:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="cyan">{currentLog.entityID || "N/A"}</Tag>
                </div>
              </Col>

              <Col span={24}>
                <Divider orientation="left">Chi tiết hành động</Divider>
                <Card
                  size="small"
                  style={{
                    marginTop: 8,
                    background: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <Paragraph
                    style={{
                      whiteSpace: "pre-wrap",
                      padding: "8px",
                    }}
                  >
                    {currentLog.actionDetails || "Không có chi tiết"}
                  </Paragraph>
                </Card>
              </Col>

              {currentLog.ipAddress && (
                <Col span={12}>
                  <Text strong>Địa chỉ IP:</Text>
                  <div style={{ marginTop: 4 }}>{currentLog.ipAddress}</div>
                </Col>
              )}

              {currentLog.browser && (
                <Col span={12}>
                  <Text strong>Trình duyệt:</Text>
                  <div style={{ marginTop: 4 }}>{currentLog.browser}</div>
                </Col>
              )}

              {currentLog.metadata && (
                <Col span={24}>
                  <Divider orientation="left">Metadata</Divider>
                  <Card size="small" style={{ marginTop: 8 }}>
                    <pre style={{ margin: 0 }}>
                      {typeof currentLog.metadata === "object"
                        ? JSON.stringify(currentLog.metadata, null, 2)
                        : currentLog.metadata}
                    </pre>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivityLog;
