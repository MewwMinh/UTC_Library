import { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Space,
  Button,
  Select,
  Input,
  Badge,
  Avatar,
  Typography,
  DatePicker,
  Card,
  notification,
  Spin,
  Tooltip,
  Empty,
} from "antd";
import styles from "/src/styles/violation/ViolationList.module.css";
import {
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EyeOutlined,
  UserOutlined,
  WarningOutlined,
  CalendarOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import violationService from "/src/services/librarian/violationService.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ViolationList = () => {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [violationType, setViolationType] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Fetch violations data
  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const response = await violationService.getAllViolations();

        if (response.success) {
          setViolations(response.data);
          setFilteredViolations(response.data);
        } else {
          notification.error({
            message: "Lỗi",
            description: response.message || "Không thể lấy danh sách vi phạm",
          });
        }
      } catch (error) {
        console.error("Error fetching violations:", error);
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  // Navigate to violation detail
  const goToDetail = (id) => {
    navigate(`/staff/violations/${id}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter violations
  useEffect(() => {
    let result = [...violations];

    // Filter by search text
    if (searchText) {
      result = result.filter((item) =>
        item.patronName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by violation type
    if (violationType) {
      result = result.filter((item) => item.violationType === violationType);
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day").valueOf();
      const endDate = dateRange[1].endOf("day").valueOf();

      result = result.filter((item) => {
        const itemDate = new Date(item.recordedAt).getTime();
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredViolations(result);
  }, [searchText, violationType, dateRange, violations]);

  // Get all unique violation types
  const violationTypes = [
    ...new Set(violations.map((item) => item.violationType)),
  ];

  // Export to Excel
  const exportToExcel = () => {
    // Transform data for export
    const exportData = filteredViolations.map((item, index) => ({
      STT: index + 1,
      "Người vi phạm": item.patronName,
      "Loại vi phạm": item.violationType,
      Sách: item.bookName || "Không liên quan",
      "Mô tả": item.description,
      "Tiền phạt": item.penaltyAmount,
      "Điểm trừ": item.pointsDeducted,
      "Người ghi nhận": item.recordedBy,
      "Thời gian": formatDate(item.recordedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Violations");

    // Adjust column widths
    const maxWidth = exportData.reduce(
      (w, r) => Math.max(w, r["Người vi phạm"].length),
      10
    );
    const colWidth = Math.max(maxWidth, 20);

    worksheet["!cols"] = [
      { wch: 5 }, // STT
      { wch: colWidth }, // Người vi phạm
      { wch: 25 }, // Loại vi phạm
      { wch: 30 }, // Sách
      { wch: 40 }, // Mô tả
      { wch: 15 }, // Tiền phạt
      { wch: 10 }, // Điểm trừ
      { wch: 20 }, // Người ghi nhận
      { wch: 25 }, // Thời gian
    ];

    // Generate file
    XLSX.writeFile(
      workbook,
      `Danh_sach_vi_pham_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    notification.success({
      message: "Xuất file thành công",
      description: "Danh sách vi phạm đã được xuất ra file Excel",
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF("landscape");

    // Add title
    doc.setFontSize(18);
    doc.text(
      "DANH SÁCH VI PHẠM THƯ VIỆN",
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: "center" }
    );

    // Add date
    doc.setFontSize(10);
    doc.text(
      `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`,
      doc.internal.pageSize.getWidth() - 20,
      15,
      { align: "right" }
    );

    // Prepare data for table
    const tableData = filteredViolations.map((item, index) => [
      index + 1,
      item.patronName,
      item.violationType,
      item.bookName || "Không liên quan",
      item.description || "",
      formatCurrency(item.penaltyAmount),
      item.pointsDeducted,
      formatDate(item.recordedAt),
    ]);

    // Generate table
    doc.autoTable({
      startY: 25,
      head: [
        [
          "STT",
          "Người vi phạm",
          "Loại vi phạm",
          "Sách",
          "Mô tả",
          "Tiền phạt",
          "Điểm trừ",
          "Thời gian",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [24, 144, 255],
        textColor: 255,
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        5: { halign: "right" },
        6: { halign: "center" },
      },
      margin: { top: 25, right: 15, bottom: 15, left: 15 },
    });

    // Save the PDF
    doc.save(`Danh_sach_vi_pham_${new Date().toISOString().slice(0, 10)}.pdf`);

    notification.success({
      message: "Xuất file thành công",
      description: "Danh sách vi phạm đã được xuất ra file PDF",
    });
  };

  const columns = [
    {
      title: "Người vi phạm",
      dataIndex: "patronName",
      key: "patronName",
      render: (text, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={record.patronImage}
            size="large"
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Loại vi phạm",
      dataIndex: "violationType",
      key: "violationType",
      render: (text) => (
        <Space>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text) => text || <Text type="secondary">Không liên quan</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text || "Không có mô tả"}>
          <Text ellipsis className={styles.tooltipText}>
            {text || "Không có mô tả"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "recordedAt",
      key: "recordedAt",
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {formatDate(text)}
        </Space>
      ),
      sorter: (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt),
    },
    {
      title: "Tiền phạt",
      dataIndex: "penaltyAmount",
      key: "penaltyAmount",
      render: (text) => formatCurrency(text),
      sorter: (a, b) => a.penaltyAmount - b.penaltyAmount,
    },
    {
      title: "Điểm trừ",
      dataIndex: "pointsDeducted",
      key: "pointsDeducted",
      render: (points) => (
        <Badge
          count={points}
          showZero
          className={styles.badge}
          style={{
            backgroundColor:
              points > 30 ? "#f5222d" : points > 10 ? "#fa8c16" : "#52c41a",
          }}
        />
      ),
      sorter: (a, b) => a.pointsDeducted - b.pointsDeducted,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          className={styles.actionButton}
          onClick={() => goToDetail(record.violationID)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <Title level={4} className={styles.cardTitle}>
          <Space style={{ marginLeft: 10 }}>
            <WarningOutlined style={{ color: "#ff4d4f" }} />
            Danh sách vi phạm
          </Space>
        </Title>
      }
      variant="borderless"
      className={styles.card}
    >
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Tìm kiếm theo tên người vi phạm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className={styles.searchInput}
          />
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder="Loại vi phạm"
            style={{ width: "100%" }}
            value={violationType}
            onChange={setViolationType}
            allowClear
            suffixIcon={<FilterOutlined />}
          >
            {violationTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <RangePicker
            style={{ width: "100%" }}
            placeholder={["Từ ngày", "Đến ngày"]}
            onChange={setDateRange}
          />
        </Col>
        <Col xs={24} md={4}>
          <Space>
            <Tooltip title="Xuất file Excel">
              <Button
                icon={<FileExcelOutlined />}
                className={`${styles.actionButton} ${styles.excelButton}`}
                onClick={exportToExcel}
              >
                Excel
              </Button>
            </Tooltip>
            <Tooltip title="Xuất file PDF">
              <Button
                icon={<FilePdfOutlined />}
                className={`${styles.actionButton} ${styles.pdfButton}`}
                onClick={exportToPDF}
              >
                PDF
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p className={styles.loadingText}>Đang tải dữ liệu...</p>
        </div>
      ) : filteredViolations.length === 0 ? (
        <Empty
          description={
            <span>
              Không tìm thấy vi phạm nào
              {searchText && ` phù hợp với từ khóa: "${searchText}"`}
            </span>
          }
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredViolations}
          rowKey="violationID"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} vi phạm`,
            size: "default",
          }}
          style={{ marginTop: 8 }}
          size="middle"
          className={styles.responsiveTable}
          rowClassName={(record, index) =>
            index % 2 === 0 ? styles.tableRowLight : styles.tableRowDark
          }
        />
      )}
    </Card>
  );
};

export default ViolationList;
