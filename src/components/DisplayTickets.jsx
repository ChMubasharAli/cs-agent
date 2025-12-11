import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";
import { notifications } from "@mantine/notifications";
import { FaTrashAlt } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { RxCheck, RxCross2 } from "react-icons/rx";

export default function DisplayTickets({
  route,
  modalOpen,
  tickets,
  selectedTicket,
  setSelectedTicket,
}) {
  const queryClient = useQueryClient();
  const [deleteTicketId, setDeleteTicketId] = useState(null);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  // Delete User using TanStack Query
  const deleteUserMutation = useMutation({
    mutationFn: (ticketId) => {
      return apiClient.delete(`/api/ticket/${ticketId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]); // Refetch users after success
      closeDeleteModal(); // Close modal

      notifications.show({
        title: "Success",
        message: "Ticket deleted successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error deleting ticket:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to delete ticket",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const handleDeleteUser = () => {
    if (deleteTicketId) {
      deleteUserMutation.mutate(deleteTicketId);
    }
  };

  // NOTE: Yahan se useEffect hata diya gaya hai jiski wajah se
  // selectedTicket automatic reset nahi ho rahi thi
  // Ab sirf user ka manual selection kaam karega

  return (
    <>
      <section className="flex gap-x-4 h-full ">
        <div className="overflow-x-auto  flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary sticky  top-0 left-0 z-30">
              <tr>
                {["Sr. No", "User", "Agent", "Type", "Priority", "Actions"].map(
                  (dataVal) => (
                    <th
                      key={dataVal}
                      className={`${
                        dataVal === "Sr. No" ? "rounded-tl-2xl" : "text-left"
                      } ${
                        dataVal === "Actions" ? "rounded-tr-2xl" : "text-left"
                      } px-6 py-4 text-sm font-semibold  tracking-wider text-white`}
                    >
                      {dataVal}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tickets?.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className={`hover:bg-primary/20 cursor-pointer text-left transition duration-200 ease-in-out ${
                    selectedTicket?.id === ticket.id ? "bg-primary/20" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 w-1/5">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap capitalize text-sm text-gray-600  w-1/5">
                    {ticket.User
                      ? ` ${ticket.User.name}`
                      : ticket.User?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 w-1/5">
                    {ticket.Agent
                      ? `${ticket.Agent.firstName} ${ticket.Agent.lastName}`
                      : "Unknown"}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 w-1/5">
                    {ticket.ticketType}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 w-1/5">
                    {ticket.priority}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 w-1/5">
                    <button
                      onClick={() => {
                        setDeleteTicketId(ticket.id);
                        openDeleteModal();
                      }}
                      type="button"
                      aria-label="Delete"
                      title="Delete"
                      className="inline-flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg  
               text-red-600 group bg-red-100 hover:text-red-700 transition-all duration-200"
                    >
                      <FaTrashAlt className="w-4 h-4 group-hover:scale-110 duration-300 transition-all" />
                    </button>
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
                {/* Ticket Summary Section */}
                {selectedTicket.summary && (
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
                      Summary
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedTicket.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
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
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
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

                  {/* Proposed Solution */}
                  {selectedTicket.proposedSolution && (
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs mb-2 font-medium text-primary uppercase tracking-wide">
                        Proposed Solution
                      </p>
                      <p className="text-xs text-gray-700">
                        {selectedTicket.proposedSolution}
                      </p>
                    </div>
                  )}

                  {/* Satisfaction Status */}
                  {selectedTicket.isSatisfied !== null && (
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                        Satisfaction
                      </p>
                      <div
                        className={`text-xs font-semibold ${
                          selectedTicket.isSatisfied
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedTicket.isSatisfied
                          ? "Satisfied"
                          : "Not Satisfied"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timestamps and Agent Info */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
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
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Created</span>
                    <span className="text-gray-700">
                      {selectedTicket.createdAt
                        ? new Date(
                            selectedTicket.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      Last Updated
                    </span>
                    <span className="text-gray-700">
                      {selectedTicket.updatedAt
                        ? new Date(
                            selectedTicket.updatedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
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
                <Link to={`${route}/${selectedTicket.id}`} className="flex-1">
                  <Button
                    radius="md"
                    size="sm"
                    fullWidth
                    classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
                  >
                    View Details
                  </Button>
                </Link>
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

      {/* Modal for delete user confirmation */}

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        size="sm"
        centered
        radius="lg"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary",
        }}
      >
        <Text mb="md">Are you sure you want to delete this ticket?</Text>
        <Group position="right" mt="md">
          <Button
            variant="outline"
            radius="md"
            size="sm"
            onClick={closeDeleteModal}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            radius="md"
            size="sm"
            onClick={handleDeleteUser}
            loading={deleteUserMutation.isPending}
            disabled={deleteUserMutation.isPending}
            loaderProps={{ type: "bars" }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
