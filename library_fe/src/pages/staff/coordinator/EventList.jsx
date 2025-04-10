import React, { useState } from "react";
import {
  Card,
  List,
  Badge,
  Tag,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Typography,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styles from "/src/styles/events/EventList.module.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Données fictives pour les événements
const mockEvents = [
  {
    id: "1",
    title: "Atelier de recherche scientifique",
    description:
      "Apprenez à utiliser efficacement les bases de données scientifiques et les outils de recherche académique.",
    startTime: "2025-04-15T10:00:00",
    endTime: "2025-04-15T12:00:00",
    location: "Salle de conférence - Étage 3",
    status: "À venir",
    registrationCount: 18,
    maxParticipants: 30,
    createdBy: "Nguyen Thi Minh",
    image: "/api/placeholder/300/120",
  },
  {
    id: "2",
    title: "Présentation des nouveaux livres",
    description:
      "Découvrez les dernières acquisitions de la bibliothèque dans le domaine des sciences et de la technologie.",
    startTime: "2025-04-20T14:00:00",
    endTime: "2025-04-20T16:00:00",
    location: "Zone de lecture principale",
    status: "À venir",
    registrationCount: 25,
    maxParticipants: 40,
    createdBy: "Trần Văn Hải",
    image: "/api/placeholder/300/120",
  },
  {
    id: "3",
    title: "Club de lecture - Littérature vietnamienne",
    description:
      "Discussion autour des œuvres classiques et contemporaines de la littérature vietnamienne.",
    startTime: "2025-04-10T16:00:00",
    endTime: "2025-04-10T18:00:00",
    location: "Salle de groupe B - Étage 2",
    status: "Terminé",
    registrationCount: 15,
    maxParticipants: 15,
    createdBy: "Lê Thanh Hương",
    image: "/api/placeholder/300/120",
  },
  {
    id: "4",
    title: "Formation aux bases de données spécialisées",
    description:
      "Apprenez à utiliser efficacement les bases de données spécialisées en ingénierie des transports.",
    startTime: "2025-05-05T09:00:00",
    endTime: "2025-05-05T11:30:00",
    location: "Laboratoire informatique - Étage 4",
    status: "À venir",
    registrationCount: 12,
    maxParticipants: 20,
    createdBy: "Pham Minh Duc",
    image: "/api/placeholder/300/120",
  },
  {
    id: "5",
    title: "Exposition: Histoire des transports au Vietnam",
    description:
      "Une exposition qui retrace l'évolution des moyens de transport au Vietnam du 19e siècle à nos jours.",
    startTime: "2025-04-25T08:00:00",
    endTime: "2025-05-10T18:00:00",
    location: "Hall d'exposition - Rez-de-chaussée",
    status: "À venir",
    registrationCount: 67,
    maxParticipants: 200,
    createdBy: "Hoang Van Thong",
    image: "/api/placeholder/300/120",
  },
];

const EventList = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();

  const handleViewEvent = (eventId) => {
    setSelectedEventId(eventId);
    navigate(`/staff/events/{eventId}`);
    // Dans une application réelle, on utiliserait un routeur pour naviguer
  };

  const getStatusBadge = (status) => {
    if (status === "À venir") {
      return (
        <Badge status="processing" text={<Tag color="blue">{status}</Tag>} />
      );
    } else if (status === "En cours") {
      return (
        <Badge status="success" text={<Tag color="green">{status}</Tag>} />
      );
    } else if (status === "Terminé") {
      return <Badge status="default" text={<Tag color="gray">{status}</Tag>} />;
    } else if (status === "Annulé") {
      return <Badge status="error" text={<Tag color="red">{status}</Tag>} />;
    }
    return <Badge status="default" text={<Tag>{status}</Tag>} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterEvents = () => {
    let filteredEvents = [...mockEvents];

    if (searchText) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchText.toLowerCase()) ||
          event.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.status === statusFilter
      );
    }

    setEvents(filteredEvents);
  };

  return (
    <div className={styles.eventListContainer}>
      <div className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Gestion des événements
        </Title>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Nouvel événement
        </Button>
      </div>

      <Card className={styles.filterCard}>
        <div className={styles.filtersContainer}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Input
                placeholder="Rechercher un événement"
                prefix={<SearchOutlined />}
                className={styles.searchInput}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={filterEvents}
              />
            </Col>

            <Col xs={24} sm={12} md={5} lg={4} xl={3}>
              <Select
                defaultValue="all"
                style={{ width: "100%" }}
                onChange={(value) => setStatusFilter(value)}
                className={styles.statusFilter}
              >
                <Option value="all">Tous les statuts</Option>
                <Option value="À venir">À venir</Option>
                <Option value="En cours">En cours</Option>
                <Option value="Terminé">Terminé</Option>
                <Option value="Annulé">Annulé</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={7} lg={8} xl={8}>
              <RangePicker
                className={styles.dateFilter}
                placeholder={["Date début", "Date fin"]}
              />
            </Col>

            <Col
              xs={24}
              sm={24}
              md={4}
              lg={4}
              xl={4}
              className={styles.filterButtonContainer}
            >
              <Button
                type="primary"
                icon={<FilterOutlined />}
                className={styles.filterButton}
                onClick={filterEvents}
                block
              >
                Filtrer
              </Button>
            </Col>
          </Row>
        </div>
      </Card>

      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={events}
        className={styles.eventGrid}
        renderItem={(event) => (
          <List.Item key={event.id}>
            <Card
              hoverable
              className={styles.eventCard}
              cover={
                <img
                  alt={event.title}
                  src={event.image}
                  className={styles.eventImage}
                />
              }
              actions={[
                <Tooltip title="Voir les détails" key="details">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewEvent(event.id)}
                  >
                    Détails
                  </Button>
                </Tooltip>,
              ]}
            >
              <div className={styles.eventHeader}>
                <Title level={4} className={styles.eventTitle}>
                  {event.title}
                </Title>
                <div className={styles.statusBadge}>
                  {getStatusBadge(event.status)}
                </div>
              </div>

              <div className={styles.eventMeta}>
                <Space
                  direction="vertical"
                  size={1}
                  className={styles.metaInfo}
                >
                  <Text className={styles.metaItem}>
                    <CalendarOutlined className={styles.metaIcon} />{" "}
                    {formatDate(event.startTime)}
                  </Text>
                  <Text className={styles.metaItem}>
                    <EnvironmentOutlined className={styles.metaIcon} />{" "}
                    {event.location}
                  </Text>
                  <Text className={styles.metaItem}>
                    <TeamOutlined className={styles.metaIcon} />{" "}
                    {event.registrationCount} / {event.maxParticipants}{" "}
                    participants
                  </Text>
                </Space>
              </div>

              <div className={styles.eventDescription}>
                <Text className={styles.description}>
                  {event.description.length > 120
                    ? `${event.description.substring(0, 120)}...`
                    : event.description}
                </Text>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default EventList;
