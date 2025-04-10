import React from "react";
import {
  Card,
  Typography,
  Space,
  Tag,
  Divider,
  Button,
  Row,
  Col,
  Descriptions,
  Avatar,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "/src/styles/events/EventInfo.module.css";

const { Title, Text, Paragraph } = Typography;

const EventInfo = ({ event }) => {
  // Formatage des dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtention du statut avec style
  const getStatusTag = (status) => {
    if (status === "À venir") {
      return <Tag color="blue">{status}</Tag>;
    } else if (status === "En cours") {
      return <Tag color="green">{status}</Tag>;
    } else if (status === "Terminé") {
      return <Tag color="gray">{status}</Tag>;
    } else if (status === "Annulé") {
      return <Tag color="red">{status}</Tag>;
    }
    return <Tag>{status}</Tag>;
  };

  return (
    <div className="event-info-container">
      <Card
        className="event-info-card"
        cover={
          <img
            alt={event.title}
            src={event.image}
            className="event-cover-image"
          />
        }
        actions={[
          <Button type="default" icon={<EditOutlined />}>
            Modifier
          </Button>,
          <Button type="danger" icon={<DeleteOutlined />}>
            Supprimer
          </Button>,
        ]}
      >
        <div className="event-info-header">
          <div className="event-title-container">
            <Title level={2} className="event-title">
              {event.title}
            </Title>
            <div className="event-status">{getStatusTag(event.status)}</div>
          </div>

          <Space direction="vertical" size={8} className="event-basic-info">
            <div className="info-row">
              <CalendarOutlined className="info-icon" />
              <Text>{formatDate(event.startTime)}</Text>
            </div>

            <div className="info-row">
              <ClockCircleOutlined className="info-icon" />
              <Text>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </Text>
            </div>

            <div className="info-row">
              <EnvironmentOutlined className="info-icon" />
              <Text>{event.location}</Text>
            </div>

            <div className="info-row">
              <TeamOutlined className="info-icon" />
              <Text>
                {event.registrationCount} / {event.maxParticipants} participants
              </Text>
            </div>
          </Space>
        </div>

        <Divider className="section-divider" />

        <div className="event-description">
          <Title level={4}>Description</Title>
          <Paragraph>{event.description}</Paragraph>
        </div>

        <Divider className="section-divider" />

        <div className="event-details">
          <Title level={4}>Détails supplémentaires</Title>
          <Descriptions
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Prérequis">
              {event.requirements || "Aucun prérequis spécifique"}
            </Descriptions.Item>
            <Descriptions.Item label="Créé par">
              <Space>
                <Avatar icon={<UserOutlined />} />
                {event.createdBy}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Contact email">
              <Space>
                <MailOutlined />
                <a href={`mailto:${event.contactEmail}`}>
                  {event.contactEmail}
                </a>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Contact téléphone">
              <Space>
                <PhoneOutlined />
                <a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Créé le">
              {formatDate(event.createdAt)} à {formatTime(event.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Mis à jour le">
              {formatDate(event.updatedAt)} à {formatTime(event.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider className="section-divider" />

        <div className="event-actions">
          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                block
                className="action-button"
              >
                Confirmer les présences
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="default"
                icon={<CloseCircleOutlined />}
                block
                className="action-button"
              >
                Clôturer l'événement
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default EventInfo;
