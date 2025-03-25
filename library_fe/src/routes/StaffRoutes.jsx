import { Route, Routes } from "react-router-dom";
import StaffLayout from "/src/components/layout/StaffLayout";
import {
  ManagePatron,
  PatronDetails,
  ManageSupportRequest,
} from "/src/pages/staff/coordinator";
import {
  ManageBook,
  LibrarianDashboard,
  BookCatalogPage,
  BookEditPage,
  BookAddPage,
  BookDetailsPage,
} from "/src/pages/staff/librarian";
const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />} path="/">
        <Route path="books" element={<BookCatalogPage />} />
        <Route path="manage-patron" element={<ManagePatron />} />
        <Route path="patron-details/:patronId" element={<PatronDetails />} />
        <Route path="manage-book" element={<ManageBook />} />
        <Route path="books/details/:bookId" element={<BookDetailsPage />} />

        <Route path="books/edit/:bookId" element={<BookEditPage />} />
        <Route path="add-book" element={<BookAddPage />} />
        <Route index element={<LibrarianDashboard />} />
        <Route path="dashboard" element={<LibrarianDashboard />} />
        <Route
          path="handle-support-request"
          element={<ManageSupportRequest />}
        />
        {/* 
          <Route path="create-user" element={<BookSearch />} />
          <Route path="handle-support-rq" element={<BookDetails />} />
          <Route path="lib-event" element={<BorrowReturn />} />
          <Route path="lib-used-history" element={<ViolationManagement />} />
          
          <Route path="handle-support-request/details" element={<RequestDetails />} />
          <Route path="handle-support-request" element={<Order />} />
          <Route path="event" element={<Event />} /> */}
      </Route>
    </Routes>
  );
};

export default StaffRoutes;
