// src/components/BookItemList.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  notification,
  Spin,
  Space,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import bookItemService from "/src/services/librarian/bookService.js";
import EditBookItemModal from "./EditBookItemModal";
import styles from "/src/styles/books/BookItemList.module.css";

const BookItemList = () => {
  const { bookId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookItems, setBookItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBookItem, setCurrentBookItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Lấy danh sách bản sao sách
  const fetchBookItems = async () => {
    setLoading(true);
    try {
      const response = await bookItemService.getBookItems(bookId);
      if (response.success) {
        setBookItems(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description:
            response.message || "Không thể tải danh sách bản sao sách",
        });
      }
    } catch (error) {
      console.error("Error fetching book items:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    if (bookId) {
      fetchBookItems();
    }
  }, [bookId]);

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (record) => {
    setCurrentBookItem(record);
    setEditModalVisible(true);
  };

  // Xử lý xóa một bản sao sách
  const handleDelete = async (itemId) => {
    try {
      setDeleteLoading(true);
      const response = await bookItemService.deleteBookItem(itemId);

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Xóa sách thành công",
        });
        fetchBookItems();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể xóa sách",
        });
      }
    } catch (error) {
      console.error("Error deleting book item:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Xử lý xóa nhiều bản sao sách
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      setDeleteLoading(true);
      const response = await bookItemService.deleteMultipleBookItems(
        selectedRowKeys
      );

      if (response.success) {
        notification.success({
          message: "Thành công",
          description: response.message || "Xóa nhiều sách thành công",
        });
        setSelectedRowKeys([]);
        fetchBookItems();
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể xóa các sách đã chọn",
        });
      }
    } catch (error) {
      console.error("Error deleting multiple book items:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Khi chỉnh sửa thành công
  const handleEditSuccess = () => {
    setEditModalVisible(false);
    fetchBookItems();
  };

  // Tạo tag cho trạng thái sách
  const getStatusTag = (status) => {
    switch (status) {
      case "Có sẵn":
        return <Tag color="success">Có sẵn</Tag>;
      case "Đang mượn":
        return <Tag color="warning">Đang mượn</Tag>;
      case "Bảo trì":
        return <Tag color="error">Bảo trì</Tag>;
      default:
        return <Tag color="purple">{status}</Tag>;
    }
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
      sorter: (a, b) => a.barcode.localeCompare(b.barcode),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      filters: [
        { text: "Có sẵn", value: "Có sẵn" },
        { text: "Đang mượn", value: "Đang mượn" },
        { text: "Bảo trì", value: "Bảo trì" },
        { text: "Khác", value: "Khác" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày nhập",
      dataIndex: "acquisitionDate",
      key: "acquisitionDate",
      sorter: (a, b) =>
        new Date(a.acquisitionDate) - new Date(b.acquisitionDate),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tình trạng",
      dataIndex: "bookCondition",
      key: "bookCondition",
      sorter: (a, b) => a.bookCondition.localeCompare(b.bookCondition),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      sorter: (a, b) => (a.notes || "").localeCompare(b.notes || ""),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space className={styles.tableActions}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bản sao sách này?"
            onConfirm={() => handleDelete(record.itemID)}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cấu hình chọn nhiều dòng
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    // Tùy chỉnh style để checkbox hiển thị rõ ràng
    columnWidth: 60,
    columnTitle: "Chọn",
    fixed: true,
    getCheckboxProps: () => ({
      style: {
        backgroundColor: "#fff",
        borderRadius: "4px",
      },
    }),
  };

  // Empty state khi không có dữ liệu
  const customEmpty = (
    <Empty
      image={<InboxOutlined className={styles.emptyStateIcon} />}
      description={
        <span className={styles.emptyStateText}>Không có bản sao sách nào</span>
      }
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách bản sao sách</h2>
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} bản sao sách đã chọn?`}
            onConfirm={handleBatchDelete}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              danger
              loading={deleteLoading}
              className={styles.deleteSelectedButton}
              icon={<DeleteOutlined />}
            >
              Xóa {selectedRowKeys.length} mục đã chọn
            </Button>
          </Popconfirm>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingSpinner}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="itemID"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={bookItems}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản sao sách`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={(pagination, filters, sorter) => {
            console.log("Table params:", pagination, filters, sorter);
            // Thêm xử lý nếu cần
          }}
          locale={{ emptyText: customEmpty }}
          scroll={{ x: "max-content" }}
        />
      )}

      <EditBookItemModal
        visible={editModalVisible}
        bookItem={currentBookItem}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default BookItemList;
