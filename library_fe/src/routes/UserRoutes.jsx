import { Route, Routes } from "react-router-dom";
import UserLayout from "/src/components/layout/UserLayout";
import {
  UserDashboard,
  BookSearch,
  BookDetails,
  BorrowReturn,
  ViolationManagement,
  SupportRequests,
  RequestDetails,
  Order,
  Event,
} from "/src/pages/user";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />} path="/">
        <Route index element={<UserDashboard />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="searchBook" element={<BookSearch />} />
        <Route path="bookDetails" element={<BookDetails />} />
        <Route path="borrowReturnBook" element={<BorrowReturn />} />
        <Route path="violation" element={<ViolationManagement />} />
        <Route path="request" element={<SupportRequests />} />
        <Route path="request/details" element={<RequestDetails />} />
        <Route path="order" element={<Order />} />
        <Route path="event" element={<Event />} />
      </Route>
    </Routes>
  );
};
export default UserRoutes;
