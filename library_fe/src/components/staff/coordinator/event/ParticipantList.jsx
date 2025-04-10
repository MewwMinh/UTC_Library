import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  Avatar,
  Tag,
  Input,
  Button,
  Tooltip,
  Space,
  Badge,
  Empty,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "/src/styles/events/ParticipantList.module.css";

const { Title, Text } = Typography;

const ParticipantList = ({ participants, eventId }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredParticipants, setFilteredParticipants] =
    useState(participants);

  // Filtrer les participants en fonction du texte de recherche
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredParticipants(participants);
      return;
    }

    const filtered = participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(value.toLowerCase()) ||
        participant.userId.toLowerCase().includes(value.toLowerCase()) ||
        participant.department.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredParticipants(filtered);
  };

  // Obtenir le tag coloré pour le type d'adhésion
  const getMembershipTag = (type) => {
    if (type === "Or") {
      return <Tag color="gold">{type}</Tag>;
    } else if (type === "Argent") {
      return <Tag color="silver">{type}</Tag>;
    } else if (type === "Bronze") {
      return <Tag color="#cd7f32">{type}</Tag>;
    }
    return <Tag>{type}</Tag>;
  };

  // Obtenir le tag coloré pour le statut de présence
  const getStatusTag = (status) => {
    if (status === "Présent") {
      return <Tag color="green">{status}</Tag>;
    } else if (status === "Inscrit") {
      return <Tag color="blue">{status}</Tag>;
    } else if (status === "Absent") {
      return <Tag color="red">{status}</Tag>;
    }
    return <Tag>{status}</Tag>;
  };

  // Formater la date d'inscription
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

  // Menu d'actions pour chaque participant
  const actionsMenu = (participant) => (
    <Menu>
      <Menu.Item key="1" icon={<CheckCircleOutlined />}>
        Marquer comme présent
      </Menu.Item>
      <Menu.Item key="2" icon={<CloseCircleOutlined />}>
        Marquer comme absent
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<MailOutlined />}>
        Envoyer un email
      </Menu.Item>
      <Menu.Item key="4" icon={<PhoneOutlined />}>
        Appeler
      </Menu.Item>
    </Menu>
  );

  return (
    <Card className="participant-list-card">
      <div className="participant-list-header">
        <Title level={3} className="participant-list-title">
          Participants
          <Badge
            count={participants.length}
            style={{
              backgroundColor: "#1890ff",
              marginLeft: "8px",
            }}
          />
        </Title>

        <Space className="participant-actions">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            className="add-participant-button"
          >
            Ajouter
          </Button>
          <Button icon={<DownloadOutlined />} className="export-button">
            Exporter
          </Button>
        </Space>
      </div>

      <div className="search-container">
        <Input
          placeholder="Rechercher un participant"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredParticipants.length === 0 ? (
        <Empty description="Aucun participant trouvé" className="empty-list" />
      ) : (
        <List
          className="participants-list"
          itemLayout="horizontal"
          dataSource={filteredParticipants}
          renderItem={(participant) => (
            <List.Item
              className="participant-item"
              actions={[
                <Dropdown
                  overlay={actionsMenu(participant)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="action-button"
                  />
                </Dropdown>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={participant.profileImage}
                    className="participant-avatar"
                  />
                }
                title={
                  <div className="participant-title">
                    <Text strong>{participant.name}</Text>
                    <div className="participant-tags">
                      {getMembershipTag(participant.membershipType)}
                      {getStatusTag(participant.attendanceStatus)}
                    </div>
                  </div>
                }
                description={
                  <div className="participant-description">
                    <div className="participant-info">
                      <Text type="secondary">
                        {participant.role} - {participant.department}
                      </Text>
                    </div>
                    <div className="participant-id">
                      <Text type="secondary">ID: {participant.userId}</Text>
                    </div>
                    <div className="registration-date">
                      <Text type="secondary">
                        Inscrit le: {formatDate(participant.registrationDate)}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default ParticipantList;
