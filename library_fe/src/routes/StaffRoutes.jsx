import { Route, Routes } from "react-router-dom";
import StaffLayout from "/src/components/layout/StaffLayout";
import {
  ManagePatron,
  PatronDetails,
  ManageSupportRequest,
} from "/src/pages/staff/coordinator";
import {
  LibrarianDashboard,
  BookCatalogPage,
  BookEditPage,
  BookAddPage,
  BookDetailsPage,
  BorrowReturnPage,
} from "/src/pages/staff/librarian";
const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />} path="/">
        <Route path="books" element={<BookCatalogPage />} />
        <Route path="books/details/:bookId" element={<BookDetailsPage />} />
        <Route path="books/edit/:bookId" element={<BookEditPage />} />
        <Route path="add-book" element={<BookAddPage />} />
        <Route path="borrow-return" element={<BorrowReturnPage />} />

        <Route path="manage-patron" element={<ManagePatron />} />
        <Route path="patron-details/:patronId" element={<PatronDetails />} />

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
