import { useState, useEffect } from "react";
import {
  Card,
  List,
  Tag,
  Typography,
  Skeleton,
  Space,
  notification,
  Input,
  Pagination,
  Row,
  Col,
  Button,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarTwoTone,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import eventService from "/src/services/coordinator/eventService.js";
import styles from "/src/styles/eventStaff/EventList.module.css";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "upcoming", "past"
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // 2 hàng, mỗi hàng 3 sự kiện

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSearchEvents();
  }, [events, filter, searchText]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();

      if (response.success) {
        setEvents(response.data);
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message || "Không thể tải danh sách sự kiện",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sự kiện:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchEvents = () => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    const now = new Date();

    // Lọc theo trạng thái (tất cả/sắp diễn ra/đã diễn ra)
    let result = [...events];
    if (filter === "upcoming") {
      result = result.filter((event) => new Date(event.endTime) >= now);
    } else if (filter === "past") {
      result = result.filter((event) => new Date(event.endTime) < now);
    }

    // Tìm kiếm theo tên sự kiện
    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter((event) =>
        event.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(result);
  };

  // Format date từ ISO string thành định dạng dd/MM/yyyy HH:mm
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Kiểm tra xem sự kiện đã diễn ra chưa
  const isEventPassed = (endTime) => {
    return new Date(endTime) < new Date();
  };

  // Tính thời lượng sự kiện (giờ và phút)
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
      return `${hours} giờ`;
    } else {
      return `${minutes} phút`;
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/staff/events/details/${eventId}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Cuộn lên đầu trang danh sách sự kiện
    window.scrollTo({
      top: document.getElementById("event-list-top").offsetTop - 100,
      behavior: "smooth",
    });
  };

  // Tính toán sự kiện hiển thị cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEvents.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.container} id="event-list-top">
      <Title level={2} className={styles.pageTitle}>
        Quản Lý Sự Kiện Thư Viện
      </Title>

      <Row gutter={[16, 24]} className={styles.actionsRow}>
        <Col xs={24} md={6} lg={6}>
          <div className={styles.filterContainer}>
            <button
              type="button"
              className={`${styles.filterButton} ${
                filter === "all" ? styles.active : ""
              }`}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
            >
              <FilterOutlined /> Tất cả
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${
                filter === "upcoming" ? styles.active : ""
              }`}
              onClick={() => {
                setFilter("upcoming");
                setCurrentPage(1);
              }}
            >
              Sắp diễn ra
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${
                filter === "past" ? styles.active : ""
              }`}
              onClick={() => {
                setFilter("past");
                setCurrentPage(1);
              }}
            >
              Đã diễn ra
            </button>
          </div>
        </Col>
        <Col xs={24} md={14} lg={14}>
          <Search
            placeholder="Tìm kiếm theo tên sự kiện"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearchText("");
                setCurrentPage(1);
              }
            }}
            className={styles.searchInput}
          />
        </Col>
        <Col xs={24} md={4} lg={4}>
          <Button
            className={styles.filterButton}
            onClick={() => navigate("/staff/events/create-event")}
          >
            Tạo mới sự kiện
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className={styles.loadingContainer}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className={styles.loadingCard}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyContainer}>
          <CalendarTwoTone
            twoToneColor="#ffaa00"
            className={styles.emptyIcon}
          />
          <Title level={4}>Không có sự kiện nào</Title>
          <Text type="secondary">
            Không tìm thấy sự kiện nào phù hợp với bộ lọc đã chọn
          </Text>
        </div>
      ) : (
        <>
          <List
            grid={{ gutter: 20, column: 3 }}
            dataSource={getCurrentPageData()}
            renderItem={(event) => {
              const isPassed = isEventPassed(event.endTime);

              return (
                <List.Item>
                  <Card
                    hoverable
                    className={styles.eventCard}
                    onClick={() => handleEventClick(event.eventID)}
                    cover={
                      <div className={styles.cardHeader}>
                        <div className={styles.eventDateBadge}>
                          <div className={styles.eventMonth}>
                            {new Date(event.startTime).toLocaleString("vi", {
                              month: "short",
                            })}
                          </div>
                          <div className={styles.eventDay}>
                            {new Date(event.startTime).getDate()}
                          </div>
                        </div>
                        <Tag
                          className={`${styles.statusTag} ${
                            isPassed ? styles.past : styles.upcoming
                          }`}
                        >
                          {isPassed ? "Đã diễn ra" : "Sắp diễn ra"}
                        </Tag>
                      </div>
                    }
                  >
                    <Title level={4} className={styles.eventTitle}>
                      {event.title}
                    </Title>

                    <Space
                      direction="vertical"
                      size="small"
                      className={styles.eventInfo}
                    >
                      <Space>
                        <CalendarOutlined className={styles.icon} />
                        <Text>{formatDate(event.startTime)}</Text>
                      </Space>

                      <Space>
                        <ClockCircleOutlined className={styles.icon} />
                        <Text>
                          {calculateDuration(event.startTime, event.endTime)}
                        </Text>
                      </Space>

                      <Space>
                        <EnvironmentOutlined className={styles.icon} />
                        <Text>{event.location}</Text>
                      </Space>

                      <Space>
                        <TeamOutlined className={styles.icon} />
                        {isPassed ? (
                          <Text>
                            {event.eventAttendeeCount || 0} người đã tham gia
                          </Text>
                        ) : (
                          <Text
                            className={
                              event.registeredParticipantCount >=
                              event.maxAttendees
                                ? styles.participationFull
                                : styles.participationAvailable
                            }
                          >
                            {event.registeredParticipantCount || 0}/
                            {event.maxAttendees || "Không giới hạn"} đã đăng ký
                          </Text>
                        )}
                      </Space>
                    </Space>

                    <Paragraph
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: "Xem thêm",
                      }}
                      className={styles.eventDescription}
                    >
                      {event.description}
                    </Paragraph>
                  </Card>
                </List.Item>
              );
            }}
          />

          {filteredEvents.length > pageSize && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredEvents.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} sự kiện`
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EventList;
