import { Route, Routes } from "react-router-dom";
import StaffLayout from "/src/components/layout/StaffLayout";
import {
  ManagePatron,
  PatronDetails,
  ManageSupportRequest,
  ManageMember,
  EventDetailPage,
  EventList,
} from "/src/pages/staff/coordinator";
import {
  LibrarianDashboard,
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
} from "/src/pages/staff/shared";
const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />} path="/">
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

        <Route path="members" element={<ManageMember />} />
        <Route path="events" element={<EventList />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route index element={<LibrarianDashboard />} />
        <Route path="dashboard" element={<LibrarianDashboard />} />
        <Route
          path="handle-support-request"
          element={<ManageSupportRequest />}
        />
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
