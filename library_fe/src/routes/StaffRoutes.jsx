import { Route, Routes } from "react-router-dom";
import StaffLayout from "/src/components/layout/StaffLayout";
import {
  PatronListPage,
  PatronDetails,
  ReadingRoomControl,
  EvenListPage,
  EventDetailPage,
  CreateNewEventPage,
} from "/src/pages/staff/coordinator";
import {
  BookCatalogPage,
  BookEditPage,
  BookAddPage,
  BookDetailsPage,
  BorrowReturnPage,
  ViolationsListPage,
  ViolationDetailPage,
} from "/src/pages/staff/librarian";
import {
  SupportRequestsPage,
  SupportRequestDetail,
  StatisticsReportPage,
  StaffDashboard,
} from "/src/pages/staff/shared";
import EmployeeProfile from "/src/pages/common/EmployeeProfile";
const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />} path="/">
        <Route index element={<StaffDashboard />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="books" element={<BookCatalogPage />} />
        <Route path="books/details/:bookId" element={<BookDetailsPage />} />
        <Route path="books/edit/:bookId" element={<BookEditPage />} />
        <Route path="add-books" element={<BookAddPage />} />
        <Route path="borrow-return" element={<BorrowReturnPage />} />
        <Route path="violations" element={<ViolationsListPage />} />
        <Route
          path="violations/:violationId"
          element={<ViolationDetailPage />}
        />

        <Route path="support-requests" element={<SupportRequestsPage />} />
        <Route
          path="support-requests/:ticketId"
          element={<SupportRequestDetail />}
        />
        <Route path="reports" element={<StatisticsReportPage />} />
        <Route path="profile" element={<EmployeeProfile />} />

        <Route path="members" element={<PatronListPage />} />
        <Route path="reading-room" element={<ReadingRoomControl />} />
        <Route path="events" element={<EvenListPage />} />
        <Route path="events/create-event" element={<CreateNewEventPage />} />
        <Route path="events/details/:eventId" element={<EventDetailPage />} />
        <Route path="patron-info/:patronID" element={<PatronDetails />} />
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
