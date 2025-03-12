import {
  UserProfile,
  BorrowedBooksList,
  Statistics,
} from "/src/components/user/common";

const UserDashboard = () => {
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <UserProfile />
      <BorrowedBooksList />
      <Statistics />
    </div>
  );
};

export default UserDashboard;
