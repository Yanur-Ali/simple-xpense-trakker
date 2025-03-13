
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import UserInfo from "../auth/UserInfo";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserInfo />
      <main className="flex-1 px-4 pb-20 pt-4 mx-auto w-full max-w-md">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default AppLayout;
