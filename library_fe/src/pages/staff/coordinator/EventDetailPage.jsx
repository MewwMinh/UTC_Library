import React, { useState, useEffect } from "react";
import { Row, Col, Button, Breadcrumb, Space } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import {
  EventInfo,
  ParticipantList,
} from "/src/components/staff/coordinator/event";
import "/src/styles/events/EventDetailPage.module.css";

// Données fictives pour l'événement
const getEventData = (eventId) => {
  const mockEvents = [
    {
      id: "1",
      title: "Atelier de recherche scientifique",
      description:
        "Apprenez à utiliser efficacement les bases de données scientifiques et les outils de recherche académique. Cet atelier est destiné aux étudiants de master et doctorat qui souhaitent améliorer leurs compétences en recherche documentaire. Nous aborderons les principales bases de données scientifiques, les stratégies de recherche avancées, et comment évaluer la qualité des sources.",
      startTime: "2025-04-15T10:00:00",
      endTime: "2025-04-15T12:00:00",
      location: "Salle de conférence - Étage 3",
      status: "À venir",
      registrationCount: 18,
      maxParticipants: 30,
      createdBy: "Nguyen Thi Minh",
      createdAt: "2025-03-01T09:30:00",
      updatedAt: "2025-03-10T14:20:00",
      image: "/api/placeholder/800/300",
      requirements:
        "Apportez votre ordinateur portable et créez un compte sur les bases de données qui seront utilisées (liste envoyée par email).",
      contactEmail: "ateliers@utc.edu.vn",
      contactPhone: "024-3123-4567",
    },
    {
      id: "2",
      title: "Présentation des nouveaux livres",
      description:
        "Découvrez les dernières acquisitions de la bibliothèque dans le domaine des sciences et de la technologie. Notre équipe présentera une sélection des ouvrages les plus récents et pertinents pour vos études et recherches. Vous aurez l'occasion de consulter ces ouvrages en avant-première et de réserver ceux qui vous intéressent.",
      startTime: "2025-04-20T14:00:00",
      endTime: "2025-04-20T16:00:00",
      location: "Zone de lecture principale",
      status: "À venir",
      registrationCount: 25,
      maxParticipants: 40,
      createdBy: "Trần Văn Hải",
      createdAt: "2025-03-05T11:15:00",
      updatedAt: "2025-03-15T16:45:00",
      image: "/api/placeholder/800/300",
      requirements: "Aucun prérequis particulier",
      contactEmail: "presentations@utc.edu.vn",
      contactPhone: "024-3123-4568",
    },
  ];

  return mockEvents.find((event) => event.id === eventId) || mockEvents[0];
};

// Données fictives pour les participants
const getParticipants = (eventId) => {
  const mockParticipants = [
    {
      id: "1",
      eventId: "1",
      userId: "SV2021001",
      name: "Lê Minh Tuấn",
      role: "Étudiant",
      membershipType: "Or",
      department: "Génie civil",
      registrationDate: "2025-03-20T09:15:00",
      attendanceStatus: "Inscrit",
      email: "leminhtuan@example.com",
      phone: "098-765-4321",
      profileImage: "/api/placeholder/40/40",
    },
    {
      id: "2",
      eventId: "1",
      userId: "SV2021052",
      name: "Nguyễn Thị Hoa",
      role: "Étudiante",
      membershipType: "Argent",
      department: "Informatique",
      registrationDate: "2025-03-20T10:30:00",
      attendanceStatus: "Inscrite",
      email: "nguyenthihoa@example.com",
      phone: "091-234-5678",
      profileImage: "/api/placeholder/40/40",
    },
    {
      id: "3",
      eventId: "1",
      userId: "GV12345",
      name: "Dr. Phạm Văn Nam",
      role: "Enseignant",
      membershipType: "Or",
      department: "Technologie des transports",
      registrationDate: "2025-03-21T14:45:00",
      attendanceStatus: "Inscrit",
      email: "phamvannam@example.com",
      phone: "097-111-2222",
      profileImage: "/api/placeholder/40/40",
    },
    {
      id: "4",
      eventId: "1",
      userId: "SV2022105",
      name: "Trần Đức Anh",
      role: "Étudiant",
      membershipType: "Bronze",
      department: "Génie mécanique",
      registrationDate: "2025-03-22T08:20:00",
      attendanceStatus: "Inscrit",
      email: "tranducanh@example.com",
      phone: "090-333-4444",
      profileImage: "/api/placeholder/40/40",
    },
    {
      id: "5",
      eventId: "1",
      userId: "SV2023012",
      name: "Vũ Thị Mai",
      role: "Étudiante",
      membershipType: "Argent",
      department: "Génie électrique",
      registrationDate: "2025-03-23T16:10:00",
      attendanceStatus: "Inscrite",
      email: "vuthimai@example.com",
      phone: "093-555-6666",
      profileImage: "/api/placeholder/40/40",
    },
    {
      id: "6",
      eventId: "2",
      userId: "SV2021005",
      name: "Hoàng Minh Quân",
      role: "Étudiant",
      membershipType: "Or",
      department: "Architecture",
      registrationDate: "2025-03-25T11:30:00",
      attendanceStatus: "Inscrit",
      email: "hoangminhquan@example.com",
      phone: "094-777-8888",
      profileImage: "/api/placeholder/40/40",
    },
  ];

  return mockParticipants.filter(
    (participant) => participant.eventId === eventId
  );
};

const EventDetailPage = ({ eventId = "1", onBack }) => {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement des données depuis une API
    setLoading(true);
    setTimeout(() => {
      setEvent(getEventData(eventId));
      setParticipants(getParticipants(eventId));
      setLoading(false);
    }, 500);
  }, [eventId]);

  const handleBack = () => {
    if (onBack && typeof onBack === "function") {
      onBack();
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement en cours...</div>;
  }

  if (!event) {
    return <div className="error-container">Événement non trouvé</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="#">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Événements</Breadcrumb.Item>
          <Breadcrumb.Item>{event.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="back-button"
        >
          Retour à la liste
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <EventInfo event={event} />
        </Col>

        <Col xs={24} lg={8}>
          <ParticipantList participants={participants} eventId={eventId} />
        </Col>
      </Row>
    </div>
  );
};

export default EventDetailPage;
