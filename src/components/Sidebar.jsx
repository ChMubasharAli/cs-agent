import { FaUser, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionIcon, Avatar, Button, Menu, Modal, Tabs } from "@mantine/core";
import { FiLogOut, FiMoreVertical } from "react-icons/fi";
import { logout } from "../store/authSlice";
import { useDisclosure } from "@mantine/hooks";
import LoginUserUpdate from "./LoginUserUpdate";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../assets/logo.jpg";
import { notifications } from "@mantine/notifications";

export function Sidebar({
  isOpen,
  setIsOpen,
  menuItems,
  setActiveItem,
  label = "add label",
}) {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // modal to show update porfile or logout user and many more
  const [opened, { open, close }] = useDisclosure(false);
  const [modalTitle, setModalTitle] = useState("Update Password");

  return (
    <>
      {/* Mobile Version */}
      <div className="flex md:hidden">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-screen overflow-auto w-full max-w-full bg-white flex flex-col backdrop-blur-xl transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-primary flex-shrink-0 flex items-center justify-between">
            <div className="text-primary text-2xl font-bold tracking-wide">
              CS Agents
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-[var(--color-primaryColor)] transition-all duration-200 p-2 rounded-xl hover:bg-gray-100/80"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems?.map((item) => (
                <li key={item.name}>
                  <NavLink
                    onClick={() => {
                      setActiveItem(item.name);
                      localStorage.setItem("activeItem", item.name);
                      setIsOpen(!isOpen);
                    }}
                    to={item.href}
                    end={item.end}
                  >
                    {({ isActive }) => (
                      <div
                        className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "text-gray-600 hover:bg-primary/20 hover:text-gray-800"
                        }`}
                      >
                        <div className="mr-3">
                          <item.icon
                            size={20}
                            className={
                              isActive
                                ? "text-primary"
                                : "text-gray-500 group-hover:text-primary"
                            }
                          />
                        </div>
                        <span
                          className={
                            isActive
                              ? "text-primary"
                              : "text-gray-500 group-hover:text-primary"
                          }
                        >
                          {item.name}
                        </span>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-primary flex-shrink-0">
            {/* Menu for Mobile */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <div className="flex items-center space-x-2 bg-secondary/10 rounded-xl p-3 hover:bg-secondary/20 cursor-pointer transition-all duration-200">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <FaUser className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 font-semibold text-sm">
                      {userData?.name || "Admin"}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {userData?.email || "admin@example.com"}
                    </div>
                  </div>
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                {/* <Menu.Item leftSection={<FiEdit size={16} />}>Edit</Menu.Item> */}
                <Menu.Item color="red" leftSection={<FiLogOut size={16} />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
      {/* Desktop Version */}
      <div className="w-64 backdrop-blur-xl bg-white md:flex hidden flex-col rounded-tr-2xl rounded-br-2xl shadow-lg relative z-10">
        <div className="p-3  border-b border-primary/20   ">
          <img src={logo} alt="logo" className="h-full w-full object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems?.map((item) => (
              <li key={item.name}>
                <NavLink
                  end={item.end}
                  onClick={() => {
                    setActiveItem(item.name);
                    localStorage.setItem("activeItem", item.name);
                  }}
                  to={item.href}
                >
                  {({ isActive }) => (
                    <div
                      className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-primary/20 text-heading border border-primary/30"
                          : "text-gray-600 hover:bg-primary/20 hover:text-heading"
                      }`}
                    >
                      <div className="mr-3">
                        <item.icon
                          size={20}
                          className={
                            isActive
                              ? "text-heading"
                              : "text-gray-500 group-hover:text-heading"
                          }
                        />
                      </div>
                      <span
                        className={
                          isActive
                            ? "text-heading font-semibold"
                            : "text-gray-500 group-hover:text-heading "
                        }
                      >
                        {item.name}
                      </span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary/20 flex-shrink-0">
          {/* Menu for Desktop */}

          <div
            onClick={open}
            className="flex items-center space-x-2 bg-secondary/10 rounded-xl p-3 hover:bg-secondary/20 cursor-pointer transition-all duration-200"
          >
            <Avatar color="blue" radius="xl">
              {userData.firstName.charAt(0).toUpperCase()}
              {""}
              {userData.lastName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex-1 min-w-0 ">
              <div className="text-heading capitalize font-semibold text-xs">
                {userData?.firstName || "Admin"} {userData?.lastName}
              </div>
              <div className="text-gray-500 text-xs truncate">
                {userData?.email || "admin@example.com"}
              </div>
            </div>
            <span>
              <FiMoreVertical size={20} className="text-blue-500" />
            </span>
          </div>
        </div>
      </div>
      {/* Modal for update profile and logout user  */}
      <Modal
        opened={opened}
        onClose={close}
        closeOnClickOutside={false}
        size="md"
        centered
        title={modalTitle}
        radius="lg"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
      >
        <Tabs color="red" variant="default" defaultValue="update">
          <Tabs.List>
            <Tabs.Tab
              onClick={() => setModalTitle("Update Password")}
              value="update"
            >
              Update Details
            </Tabs.Tab>

            <Tabs.Tab onClick={() => setModalTitle("Logout")} value="logout">
              Logout
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="update">
            <LoginUserUpdate />
          </Tabs.Panel>

          <Tabs.Panel value="logout">
            <div className="p-4 flex items-center justify-end">
              <Button
                size="sm"
                radius={"md"}
                classNames={{ root: "!bg-accent hover:!bg-accent-hover" }}
                onClick={() => {
                  dispatch(logout());
                  queryClient.clear();
                  notifications.show({
                    title: "Success",
                    message: "You have been logged out successfully",
                    color: "green",
                    position: "top-right",
                    autoClose: 4000,
                  });
                }}
              >
                Logout
              </Button>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}
