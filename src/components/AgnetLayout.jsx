import { useState } from "react";
import { FaHome, FaUser, FaPhoneVolume } from "react-icons/fa";
import { LuTickets } from "react-icons/lu";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

export default function AgentLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("activeItem") || "Dashboard";
  });

  const menuItems = [
    { name: "Dashboard", icon: FaHome, href: ".", end: true },
    { name: "Tickets", icon: LuTickets, href: "tickets" },
    { name: "Calls", icon: FaPhoneVolume, href: "calls" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#fcfefe] to-[#f8f9fa] ">
      <Sidebar
        label="CS Agent"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setActiveItem={setActiveItem}
        menuItems={menuItems}
      />
      {/* Main Content */}
      <div className={`flex-1 flex flex-col px-4 overflow-auto bg-gray-100`}>
        <div className=" sticky top-0 left-0 py-2 z-40 rounded-2xl bg-gray-100">
          <Header
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            activeItem={activeItem}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
