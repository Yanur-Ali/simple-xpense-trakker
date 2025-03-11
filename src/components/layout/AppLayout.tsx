
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background antialiased">
      <main className="flex-1 pb-16 pt-4 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default AppLayout;
