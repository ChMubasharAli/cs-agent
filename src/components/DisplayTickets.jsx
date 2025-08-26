import {
  Avatar,
  Button,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Rating,
} from "@mantine/core";
import { useEffect } from "react";

export default function DisplayTickets({
  modalOpen,
  tickets,
  selectedTicket,
  setSelectedTicket,
}) {
  // State to track selected ticket (assuming you have a state management like useState)

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    // Add your edit logic here
  };

  const handleOpenDeleteModal = (id) => {
    // Add your delete modal logic here
  };

  useEffect(() => {
    if (tickets.length > 0) {
      setSelectedTicket(tickets[0]);
    }
  }, [tickets]);

  return (
    <section className="flex gap-x-4 h-full ">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary sticky  top-0 left-0 z-30">
            <tr>
              {["Sr. No", "User", "Agent", "Type", "Priority"].map(
                (dataVal, index) => (
                  <th
                    key={dataVal}
                    className={`${
                      dataVal === "Sr. No" ? "rounded-tl-2xl" : "text-left"
                    } ${
                      dataVal === "Priority" ? "rounded-tr-2xl" : "text-left"
                    } px-6 py-4 text-sm font-semibold  tracking-wider text-white`}
                  >
                    {dataVal}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tickets.map((ticket, index) => (
              <tr
                key={ticket.id}
                className={`hover:bg-primary/20 cursor-pointer text-left transition duration-200 ease-in-out ${
                  selectedTicket?.id === ticket.id ? "bg-primary/20" : ""
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm font-medium text-gray-900">
                  {ticket.User
                    ? ` ${ticket.User.name}`
                    : ticket.User?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {ticket.Agent
                    ? `${ticket.Agent.firstName} ${ticket.Agent.lastName}`
                    : "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {ticket.ticketType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {ticket.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Right section */}
      <section className="w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {selectedTicket ? (
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Ticket Status
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTicket.status === "open"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedTicket.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedTicket.status?.replace("_", " ").toUpperCase() ||
                    "OPEN"}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3 text-center tracking-wider">
                  Customer Information
                </h4>

                <div className="flex items-center space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-900 mb-1 tracking-wider">
                      Name:{" "}
                      <span className="font-normal text-xs ">
                        {selectedTicket?.User?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-xs mb-1 font-medium text-gray-900 tracking-wider">
                      Email:{" "}
                      <span className="font-normal text-xs">
                        {selectedTicket?.User?.email || "N/A"}
                      </span>
                    </p>
                    <p className="text-xs font-medium text-gray-900 tracking-wider">
                      Phone:{" "}
                      <span className="font-normal text-xs">
                        {selectedTicket?.User?.phone || "5677722608"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Type
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1 capitalize ">
                      {selectedTicket.ticketType || "General"}
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Priority
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1 capitalize">
                      {selectedTicket.priority || "Medium"}
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-xs mb-2 font-medium text-primary uppercase tracking-wide">
                    Rating
                  </p>
                  <Rating readOnly defaultValue={selectedTicket.rating} />
                </div>
              </div>

              {selectedTicket.description && (
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Description
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Created</span>
                  <span className="text-gray-700">
                    {selectedTicket.createdAt
                      ? new Date(selectedTicket.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Last Updated
                  </span>
                  <span className="text-gray-700">
                    {selectedTicket.updatedAt
                      ? new Date(selectedTicket.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                {selectedTicket.Agent && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      Assigned Agent
                    </span>
                    <span className="text-gray-700">
                      {selectedTicket.Agent.firstName}{" "}
                      {selectedTicket.Agent.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t flex gap-2 border-gray-200 p-4 bg-gray-50">
              <Button
                radius="md"
                size="sm"
                onClick={modalOpen}
                fullWidth
                classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
              >
                Update Ticket
              </Button>
              <Button
                radius="md"
                size="sm"
                fullWidth
                classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
              >
                View
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm font-medium">
                Select a ticket to view details
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Click on any row in the table
              </p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
