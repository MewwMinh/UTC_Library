import { useState } from "react";
import {
  Layout,
  Card,
  Tabs,
  Form,
  Button,
  Switch,
  Select,
  message,
  Divider,
  Row,
  Col,
  Badge,
  Space,
  Radio,
  Typography,
  Statistic,
  Alert,
  Tag,
  Progress,
  Tooltip,
  FloatButton,
  Input,
} from "antd";
import {
  BellOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  BulbOutlined,
  EyeInvisibleOutlined,
  BookOutlined,
  NotificationOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  CloudOutlined,
  CloudSyncOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SyncOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DashboardOutlined,
  SlidersFilled,
  ThunderboltOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import styles from "./EmployeeSettings.module.css";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const EmployeeSettings = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [themeMode, setThemeMode] = useState("light");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleNotificationSettings = (values) => {
    message.success("Cài đặt thông báo đã được lưu!");
    console.log("Cài đặt thông báo:", values);
  };

  const handleThemeChange = (e) => {
    setThemeMode(e.target.value);
    message.success(
      `Đã chuyển sang chế độ ${e.target.value === "light" ? "sáng" : "tối"}!`
    );
  };

  return (
    <Layout className={styles.settingsLayout}>
      <Content className={styles.settingsContent}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <Title level={2} className={styles.title}>
                <SlidersFilled className={styles.titleIcon} /> Cài Đặt Hệ Thống
              </Title>
              <Text type="secondary" className={styles.subtitle}>
                Tùy chỉnh cài đặt để tối ưu hóa trải nghiệm sử dụng hệ thống thư
                viện
              </Text>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.settingsContainer}>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={4}>
                <div className={styles.sidebarContainer}>
                  <div className={styles.systemInfo}>
                    <div className={styles.systemInfoItem}>
                      <Statistic
                        title="Phiên bản hệ thống"
                        value="1.0.0"
                        prefix={<CloudOutlined />}
                      />
                      <Tag color="green">Mới nhất</Tag>
                    </div>
                    <div className={styles.systemInfoItem}>
                      <Progress
                        type="dashboard"
                        percent={83}
                        width={80}
                        format={() => (
                          <DatabaseOutlined style={{ fontSize: 24 }} />
                        )}
                      />
                      <Text className={styles.storageText}>Lưu trữ</Text>
                    </div>
                  </div>

                  <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    tabPosition="left"
                    className={styles.settingsTabs}
                  >
                    <TabPane
                      tab={
                        <span className={styles.tabItem}>
                          <BellOutlined /> Thông báo
                        </span>
                      }
                      key="1"
                    />
                    <TabPane
                      tab={
                        <span className={styles.tabItem}>
                          <SettingOutlined /> Giao diện
                        </span>
                      }
                      key="2"
                    />
                    <TabPane
                      tab={
                        <span className={styles.tabItem}>
                          <SecurityScanOutlined /> Quyền riêng tư
                        </span>
                      }
                      key="3"
                    />
                    <TabPane
                      tab={
                        <span className={styles.tabItem}>
                          <ApiOutlined /> API & Tích hợp
                        </span>
                      }
                      key="4"
                    />
                    <TabPane
                      tab={
                        <span className={styles.tabItem}>
                          <DashboardOutlined /> Hiệu suất
                        </span>
                      }
                      key="5"
                    />
                  </Tabs>
                </div>
              </Col>

              <Col xs={24} lg={20}>
                <div className={styles.tabContent}>
                  {activeTab === "1" && (
                    <Card
                      className={`${styles.card} ${styles.animatedCard}`}
                      bordered={false}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <Title level={4}>
                            <NotificationOutlined className={styles.cardIcon} />{" "}
                            Cài Đặt Thông Báo
                          </Title>
                          <Text type="secondary">
                            Quản lý cách bạn nhận thông báo
                          </Text>
                        </div>
                        <ThunderboltOutlined className={styles.featureIcon} />
                      </div>
                      <Divider />

                      <Alert
                        type="info"
                        message="Mẹo: Bật thông báo qua email để không bỏ lỡ các thông báo quan trọng!"
                        showIcon
                        className={styles.alertInfo}
                      />

                      <Form
                        layout="vertical"
                        initialValues={{
                          emailNotifications: true,
                          pushNotifications: true,
                          soundEnabled: true,
                          borrowReturnNotifications: true,
                          systemUpdates: true,
                          eventReminders: true,
                          supportRequests: true,
                        }}
                        onFinish={handleNotificationSettings}
                      >
                        <Row gutter={[24, 0]}>
                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Kênh thông báo
                              </Title>

                              <Form.Item
                                name="emailNotifications"
                                label={
                                  <div className={styles.switchLabel}>
                                    <span>Nhận thông báo qua email</span>
                                    <Tag color="blue">Khuyến nghị</Tag>
                                  </div>
                                }
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="pushNotifications"
                                label="Nhận thông báo đẩy"
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="soundEnabled"
                                label="Âm thanh thông báo"
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Loại thông báo
                              </Title>

                              <Form.Item
                                name="borrowReturnNotifications"
                                label={
                                  <Space>
                                    <BookOutlined />
                                    <span>Mượn/trả sách</span>
                                  </Space>
                                }
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="systemUpdates"
                                label={
                                  <Space>
                                    <SettingOutlined />
                                    <span>Cập nhật hệ thống</span>
                                  </Space>
                                }
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="eventReminders"
                                label={
                                  <Space>
                                    <CalendarOutlined />
                                    <span>Nhắc nhở sự kiện</span>
                                  </Space>
                                }
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="supportRequests"
                                label={
                                  <Space>
                                    <NotificationOutlined />
                                    <span>Yêu cầu hỗ trợ mới</span>
                                  </Space>
                                }
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>

                        <div className={styles.statisticsSection}>
                          <Title level={5}>Thống kê thông báo</Title>
                          <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                              <Card className={styles.statCard}>
                                <Statistic
                                  title="Đã gửi hôm nay"
                                  value={24}
                                  prefix={<BarChartOutlined />}
                                />
                              </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Card className={styles.statCard}>
                                <Statistic
                                  title="Đã nhận"
                                  value={18}
                                  prefix={<PieChartOutlined />}
                                />
                              </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Card className={styles.statCard}>
                                <Statistic
                                  title="Đã đọc"
                                  value={15}
                                  suffix={<small>/18</small>}
                                />
                              </Card>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Card className={styles.statCard}>
                                <Statistic
                                  title="Tỷ lệ mở"
                                  value="83%"
                                  prefix={<PieChartOutlined />}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </div>

                        <Form.Item className={styles.formActions}>
                          <Button type="primary" htmlType="submit" size="large">
                            Lưu thay đổi
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}

                  {activeTab === "2" && (
                    <Card
                      className={`${styles.card} ${styles.animatedCard}`}
                      bordered={false}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <Title level={4}>
                            <BulbOutlined className={styles.cardIcon} /> Cài Đặt
                            Giao Diện
                          </Title>
                          <Text type="secondary">
                            Tùy chỉnh giao diện người dùng
                          </Text>
                        </div>
                        <RocketOutlined className={styles.featureIcon} />
                      </div>
                      <Divider />

                      <div className={styles.themePreview}>
                        <div
                          className={`${styles.themeBox} ${
                            themeMode === "light" ? styles.activeTheme : ""
                          }`}
                        >
                          <div className={styles.lightThemePreview}>
                            <div className={styles.previewHeader}></div>
                            <div className={styles.previewContent}>
                              <div className={styles.previewSidebar}></div>
                              <div className={styles.previewMain}></div>
                            </div>
                          </div>
                          <Text>Chế độ sáng</Text>
                        </div>
                        <div
                          className={`${styles.themeBox} ${
                            themeMode === "dark" ? styles.activeTheme : ""
                          }`}
                        >
                          <div className={styles.darkThemePreview}>
                            <div className={styles.previewHeader}></div>
                            <div className={styles.previewContent}>
                              <div className={styles.previewSidebar}></div>
                              <div className={styles.previewMain}></div>
                            </div>
                          </div>
                          <Text>Chế độ tối</Text>
                        </div>
                      </div>

                      <Form layout="vertical">
                        <Row gutter={[24, 0]}>
                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Hiển thị
                              </Title>

                              <Form.Item label="Chế độ hiển thị">
                                <Radio.Group
                                  value={themeMode}
                                  onChange={handleThemeChange}
                                >
                                  <Radio.Button value="light">
                                    <BulbOutlined /> Sáng
                                  </Radio.Button>
                                  <Radio.Button value="dark">
                                    <EyeInvisibleOutlined /> Tối
                                  </Radio.Button>
                                  <Radio.Button value="system">
                                    <SettingOutlined /> Hệ thống
                                  </Radio.Button>
                                </Radio.Group>
                              </Form.Item>

                              <Form.Item label="Font chữ">
                                <Select defaultValue="default">
                                  <Option value="default">Mặc định</Option>
                                  <Option value="roboto">Roboto</Option>
                                  <Option value="openSans">Open Sans</Option>
                                  <Option value="lato">Lato</Option>
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Cá nhân hóa
                              </Title>

                              <Form.Item label="Màu chủ đạo">
                                <div className={styles.colorSelection}>
                                  <Badge
                                    color="#1677ff"
                                    className={styles.colorBadge}
                                  />
                                  <Badge
                                    color="#52c41a"
                                    className={styles.colorBadge}
                                  />
                                  <Badge
                                    color="#fa8c16"
                                    className={styles.colorBadge}
                                  />
                                  <Badge
                                    color="#722ed1"
                                    className={styles.colorBadge}
                                  />
                                  <Badge
                                    color="#eb2f96"
                                    className={styles.colorBadge}
                                  />
                                  <Badge
                                    color="#f5222d"
                                    className={styles.colorBadge}
                                  />
                                </div>
                              </Form.Item>

                              <Form.Item
                                name="compactView"
                                label="Giao diện thu gọn"
                                valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item label="Kích thước hiển thị bảng">
                                <Select defaultValue="default">
                                  <Option value="small">Nhỏ</Option>
                                  <Option value="default">Mặc định</Option>
                                  <Option value="large">Lớn</Option>
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>

                        <Form.Item className={styles.formActions}>
                          <Button type="primary" size="large">
                            Lưu thay đổi
                          </Button>
                          <Button style={{ marginLeft: 8 }}>
                            Khôi phục mặc định
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}

                  {activeTab === "3" && (
                    <Card
                      className={`${styles.card} ${styles.animatedCard}`}
                      bordered={false}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <Title level={4}>
                            <SecurityScanOutlined className={styles.cardIcon} />{" "}
                            Cài Đặt Quyền Riêng Tư
                          </Title>
                          <Text type="secondary">
                            Quản lý các cài đặt quyền riêng tư và dữ liệu
                          </Text>
                        </div>
                        <ThunderboltOutlined className={styles.featureIcon} />
                      </div>
                      <Divider />

                      <Alert
                        type="warning"
                        message="Quan trọng: Cài đặt quyền riêng tư có thể ảnh hưởng đến trải nghiệm của bạn"
                        description="Một số tính năng có thể bị hạn chế nếu bạn tắt theo dõi hoạt động."
                        showIcon
                        className={styles.alertInfo}
                      />

                      <Form layout="vertical">
                        <Row gutter={[24, 0]}>
                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Lịch sử hoạt động
                              </Title>

                              <Form.Item
                                name="activityTracking"
                                label="Theo dõi hoạt động của tôi"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item label="Thời gian lưu trữ lịch sử hoạt động">
                                <Select defaultValue="90">
                                  <Option value="30">30 ngày</Option>
                                  <Option value="90">90 ngày</Option>
                                  <Option value="180">180 ngày</Option>
                                  <Option value="365">1 năm</Option>
                                </Select>
                              </Form.Item>

                              <Button type="default" danger>
                                Xóa lịch sử hoạt động
                              </Button>
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Dữ liệu cá nhân
                              </Title>

                              <Form.Item
                                name="shareData"
                                label="Chia sẻ dữ liệu với bộ phận IT để cải thiện hệ thống"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item
                                name="visibleProfile"
                                label="Hiển thị hồ sơ cho nhân viên khác"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item
                                name="anonymousStatistics"
                                label="Đóng góp số liệu thống kê ẩn danh"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>

                        <div className={styles.privacyInfo}>
                          <Title level={5}>Thông tin quyền riêng tư</Title>
                          <Paragraph>
                            Thư viện Đại học Giao thông vận tải cam kết bảo vệ
                            dữ liệu của bạn. Dữ liệu được thu thập chỉ nhằm mục
                            đích cải thiện dịch vụ và trải nghiệm người dùng.
                          </Paragraph>
                          <Paragraph>
                            <a href="#">Xem chính sách quyền riêng tư đầy đủ</a>
                          </Paragraph>
                        </div>

                        <Form.Item className={styles.formActions}>
                          <Button type="primary" size="large">
                            Lưu thay đổi
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}

                  {activeTab === "4" && (
                    <Card
                      className={`${styles.card} ${styles.animatedCard}`}
                      bordered={false}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <Title level={4}>
                            <ApiOutlined className={styles.cardIcon} /> API &
                            Tích Hợp
                          </Title>
                          <Text type="secondary">
                            Quản lý kết nối và tích hợp với các hệ thống khác
                          </Text>
                        </div>
                        <CloudSyncOutlined className={styles.featureIcon} />
                      </div>
                      <Divider />

                      <Alert
                        type="info"
                        message="Chức năng API nâng cao dành cho quản trị viên hệ thống"
                        description="Các cài đặt này chỉ nên được thay đổi bởi nhân viên IT hoặc quản trị viên hệ thống."
                        showIcon
                        className={styles.alertInfo}
                      />

                      <Form layout="vertical">
                        <Row gutter={[24, 0]}>
                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Kết nối API
                              </Title>

                              <Form.Item
                                name="enableApi"
                                label="Kích hoạt API"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item label="Giới hạn yêu cầu API (mỗi phút)">
                                <Select defaultValue="60">
                                  <Option value="30">30</Option>
                                  <Option value="60">60</Option>
                                  <Option value="100">100</Option>
                                  <Option value="200">200</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item label="Khóa API">
                                <Row gutter={8}>
                                  <Col flex="auto">
                                    <Input.Password
                                      value="sk_live_51KGwezJyDENVA5v2rVpQ"
                                      disabled
                                    />
                                  </Col>
                                  <Col>
                                    <Button>Làm mới</Button>
                                  </Col>
                                </Row>
                              </Form.Item>
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Tích hợp bên thứ ba
                              </Title>

                              <Form.Item
                                name="googleCalendar"
                                label="Google Calendar"
                                valuePropName="checked"
                                extra="Đồng bộ sự kiện thư viện với Google Calendar"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="microsoftTeams"
                                label="Microsoft Teams"
                                valuePropName="checked"
                                extra="Gửi thông báo qua Microsoft Teams"
                              >
                                <Switch />
                              </Form.Item>

                              <Form.Item
                                name="zapier"
                                label="Zapier"
                                valuePropName="checked"
                                extra="Kết nối với các ứng dụng khác qua Zapier"
                              >
                                <Switch />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>

                        <div className={styles.webhooksSection}>
                          <Title level={5} className={styles.sectionTitle}>
                            Webhook
                          </Title>
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <Card size="small" className={styles.webhookCard}>
                                <div className={styles.webhookItem}>
                                  <div>
                                    <Text strong>
                                      Webhook thông báo mượn sách
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                      https://webhook.site/abc123
                                    </Text>
                                  </div>
                                  <Space>
                                    <Tag color="green">Hoạt động</Tag>
                                    <Button size="small">Chỉnh sửa</Button>
                                    <Button size="small" danger>
                                      Xóa
                                    </Button>
                                  </Space>
                                </div>
                              </Card>
                            </Col>
                            <Col span={24}>
                              <Card size="small" className={styles.webhookCard}>
                                <div className={styles.webhookItem}>
                                  <div>
                                    <Text strong>Webhook sự kiện thư viện</Text>
                                    <br />
                                    <Text type="secondary">
                                      https://example.com/events-webhook
                                    </Text>
                                  </div>
                                  <Space>
                                    <Tag color="green">Hoạt động</Tag>
                                    <Button size="small">Chỉnh sửa</Button>
                                    <Button size="small" danger>
                                      Xóa
                                    </Button>
                                  </Space>
                                </div>
                              </Card>
                            </Col>
                            <Col span={24}>
                              <Button type="dashed" block>
                                + Thêm webhook mới
                              </Button>
                            </Col>
                          </Row>
                        </div>

                        <Form.Item className={styles.formActions}>
                          <Button type="primary" size="large">
                            Lưu thay đổi
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}

                  {activeTab === "5" && (
                    <Card
                      className={`${styles.card} ${styles.animatedCard}`}
                      bordered={false}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <Title level={4}>
                            <DashboardOutlined className={styles.cardIcon} />{" "}
                            Hiệu Suất
                          </Title>
                          <Text type="secondary">
                            Tối ưu hóa hiệu suất hệ thống
                          </Text>
                        </div>
                        <SyncOutlined className={styles.featureIcon} />
                      </div>
                      <Divider />

                      <div className={styles.performanceStats}>
                        <Row gutter={[16, 16]}>
                          <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                              <Statistic
                                title="CPU"
                                value={23}
                                suffix="%"
                                valueStyle={{ color: "#3f8600" }}
                              />
                              <Progress
                                percent={23}
                                size="small"
                                status="success"
                              />
                            </Card>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                              <Statistic
                                title="RAM"
                                value={45}
                                suffix="%"
                                valueStyle={{ color: "#3f8600" }}
                              />
                              <Progress
                                percent={45}
                                size="small"
                                status="success"
                              />
                            </Card>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                              <Statistic
                                title="Disk"
                                value={78}
                                suffix="%"
                                valueStyle={{ color: "#faad14" }}
                              />
                              <Progress
                                percent={78}
                                size="small"
                                status="normal"
                                strokeColor="#faad14"
                              />
                            </Card>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Card className={styles.statCard}>
                              <Statistic
                                title="Uptime"
                                value="99.8"
                                suffix="%"
                                valueStyle={{ color: "#3f8600" }}
                              />
                              <div className={styles.uptimeIndicator}>
                                <div className={styles.uptimeDot}></div>
                                <Text type="secondary">Đang hoạt động</Text>
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      </div>

                      <Form layout="vertical">
                        <Row gutter={[24, 0]}>
                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Tối ưu hóa
                              </Title>

                              <Form.Item
                                name="caching"
                                label={
                                  <Tooltip title="Lưu trữ dữ liệu tạm thời để cải thiện tốc độ">
                                    <Space>
                                      <span>Bật bộ nhớ đệm</span>
                                      <QuestionCircleOutlined />
                                    </Space>
                                  </Tooltip>
                                }
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item
                                name="imageCompression"
                                label="Nén hình ảnh tự động"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item
                                name="lazyLoading"
                                label="Tải chậm nội dung"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className={styles.settingsSection}>
                              <Title level={5} className={styles.sectionTitle}>
                                Bảo trì
                              </Title>

                              <Form.Item
                                name="autoUpdate"
                                label="Cập nhật tự động"
                                valuePropName="checked"
                              >
                                <Switch defaultChecked />
                              </Form.Item>

                              <Form.Item label="Tự động khởi động lại">
                                <Select defaultValue="never">
                                  <Option value="daily">Hàng ngày</Option>
                                  <Option value="weekly">Hàng tuần</Option>
                                  <Option value="monthly">Hàng tháng</Option>
                                  <Option value="never">Không bao giờ</Option>
                                </Select>
                              </Form.Item>

                              <Space>
                                <Button icon={<SyncOutlined />}>
                                  Làm mới bộ nhớ đệm
                                </Button>
                                <Button>Sao lưu hệ thống</Button>
                              </Space>
                            </div>
                          </Col>
                        </Row>

                        <Form.Item className={styles.formActions}>
                          <Button type="primary" size="large">
                            Lưu thay đổi
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Content>

      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton tooltip="Trợ giúp" icon={<QuestionCircleOutlined />} />
        <FloatButton tooltip="Phản hồi" />
      </FloatButton.Group>
    </Layout>
  );
};

export default EmployeeSettings;
