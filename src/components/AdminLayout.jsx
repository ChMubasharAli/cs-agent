import { useState } from "react";
import { FaHome, FaTicketAlt, FaUser } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("activeItem") || "Dashboard";
  });

  const menuItems = [
    { name: "Dashboard", icon: FaHome, href: ".", end: true },
    { name: "Agents", icon: MdSupportAgent, href: "agents" },
    { name: "Tickets", icon: FaTicketAlt, href: "tickets" },
    { name: "Users", icon: FaUser, href: "users" },
  ];

  return (
    <div className="flex h-screen ">
      <Sidebar
        label="CS Admin"
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
