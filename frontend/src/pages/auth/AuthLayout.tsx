import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    // 🟢 Ghost Wrapper
    // We removed the flex-split and the image column.
    // Now, the Login/Signup pages have full control over the 100vh screen.
    <div className="w-full min-h-screen">
      <Outlet />
    </div>
  );
};