import React, { useState, useEffect } from "react"; // useEffect add کیا ہے
import { LoaderComp, DisplayTickets } from "../../components";
import { Button, Modal, Select, Tabs, Text, Title, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notifications } from "@mantine/notifications";
import { RxCheck, RxCross2 } from "react-icons/rx";
import apiClient from "../../api/axios";

export default function Tickets({
  apiKey = "/api/tickets",
  route = "/admin/tickets",
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Frontend pagination ke liye

  const queryClient = useQueryClient();

  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPrority] = useState("");

  // User role ke liye state add ki hai
  const [userRole, setUserRole] = useState("");

  // Component load hone par localStorage se userData get karna
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserRole(userData.role || "");
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  // Fetch All Tickets using TanStack Query
  const {
    data: ticketsData = [],
    isLoading: ticketFetchingLoading,
    error: ticketFetchingError,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => {
      return apiClient.get(apiKey).then((response) => response.data);
    },
  });

  // Fetch All Agents using TanStack Query
  const { data: agentsData = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: () => {
      return apiClient.get("/api/agents").then((response) => response.data);
    },
  });

  // Frontend Pagination Logic
  const totalTickets = ticketsData.length || 0;
  const totalPages = Math.ceil(totalTickets / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  // Current page ke tickets calculate karein
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = ticketsData.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Transfer Ticket to the Agent usign TanStack Query
  const transferTicketMutation = useMutation({
    mutationFn: ({ ticketId, agentId }) => {
      console.log("Transferring ticket:", ticketId, "to agent:", agentId);
      return apiClient.patch(`/api/tickets/${ticketId}/assign/${agentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]); // Refetch agents after success
      close(); // Close modal
      // Show success notification

      notifications.show({
        title: "Success",
        message: "Ticket tranfer successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error transferring ticket:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to transfer ticket",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Update Ticket stuts usign TanStack Query
  const ticketStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }) => {
      return apiClient.patch(`/api/tickets/${ticketId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]); // Refetch agents after success
      close(); // Close modal
      // Show success notification

      notifications.show({
        title: "Success",
        message: "Ticket status updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error updating ticket status:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.error || "Failed to update ticket status",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Update Ticket Priority using TanStack Query
  const ticketPriorityMutation = useMutation({
    mutationFn: ({ ticketId, priority }) => {
      return apiClient.patch(`/api/tickets/${ticketId}/piority`, {
        priority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]); // Refetch agents after success
      close(); // Close modal
      // Show success notification

      notifications.show({
        title: "Success",
        message: "Ticket priority updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error updating ticket priority:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.error || "Failed to update ticket priority",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return (
    <>
      <main className="p4-4 container mx-auto max-h-[85vh] h-full   ">
        {ticketFetchingLoading ? (
          <LoaderComp />
        ) : ticketFetchingError ? (
          <Text py={"md"} ta={"center"} c={"red"}>
            Failed to load Tickets: {ticketFetchingError.message}
          </Text>
        ) : !Array.isArray(ticketsData) || ticketsData.length === 0 ? (
          <Text py={"md"} ta={"center"}>
            No tickets found.
          </Text>
        ) : (
          <section className="h-full bg-white rounded-2xl p-2 flex flex-col shadow-lg">
            {/* Tickets Table Section */}
            <div className="flex-1 overflow-y-auto">
              <DisplayTickets
                route={route}
                tickets={currentTickets} // Current page ke tickets pass karein
                modalOpen={open}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
              />
            </div>

            {/* Pagination Section - Exact same design as Calls component */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
              {/* Previous/Next Buttons Only */}
              <Group gap="sm">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  radius={"md"}
                  onClick={handlePrevPage}
                  disabled={!hasPrev}
                  classNames={{
                    root: `!border-primary !text-primary hover:!bg-primary/10 ${
                      !hasPrev ? "!opacity-50 !cursor-not-allowed" : ""
                    }`,
                  }}
                  leftSection={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  }
                >
                  Previous
                </Button>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  radius={"md"}
                  onClick={handleNextPage}
                  disabled={!hasNext}
                  classNames={{
                    root: `!border-primary !text-primary hover:!bg-primary/10 ${
                      !hasNext ? "!opacity-50 !cursor-not-allowed" : ""
                    }`,
                  }}
                  rightSection={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  }
                >
                  Next
                </Button>
              </Group>

              <Text size="sm" c="dimmed">
                Page {currentPage} of {totalPages} • {totalTickets} total
                tickets
              </Text>
            </div>
          </section>
        )}
      </main>
      {/* Modal for update ticket  */}
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"lg"}
        closeOnClickOutside={false}
        overlayProps={{ opacity: 1 }}
        title="Update Ticket"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
        radius="lg"
      >
        {/* Modal content */}

        <Tabs defaultValue="status" variant="outline">
          <Tabs.List>
            {/* Conditionally render tabs based on user role */}
            {userRole === "admin" ? (
              // Admin ke liye saare 3 tabs show karein
              <>
                <Tabs.Tab value="transfer">Transfer</Tabs.Tab>
                <Tabs.Tab value="status">Status</Tabs.Tab>
                <Tabs.Tab value="priority">Priority</Tabs.Tab>
              </>
            ) : (
              // Agent ya kisi aur role ke liye sirf status tab show karein
              <Tabs.Tab value="status">Status</Tabs.Tab>
            )}
          </Tabs.List>

          {/* Transfer Tab Panel - sirf admin ke liye */}
          {userRole === "admin" && (
            <Tabs.Panel value="transfer">
              <Title
                my={"md"}
                ta={"center"}
                classNames={{ root: "!text-heading" }}
                order={3}
              >
                Transfer Your Ticket
              </Title>

              <section className="flex items-center justify-center flex-col gap-3">
                <Select
                  classNames={{ root: "!w-full", label: "mb-1" }}
                  label="Select Agent"
                  value={selectedAgent}
                  onChange={setSelectedAgent}
                  data={agentsData?.map((agent) => ({
                    value: agent.id.toString(), // string required
                    label: `${agent?.firstName} ${agent?.lastName}`, // text to display
                  }))}
                  radius="md"
                  placeholder="Choose an agent"
                  searchable
                />

                <Button
                  radius="md"
                  onClick={() =>
                    transferTicketMutation.mutate({
                      ticketId: selectedTicket.id,
                      agentId: selectedAgent,
                    })
                  }
                  loading={transferTicketMutation.isPending}
                  loaderProps={{ type: "bars" }}
                  fullWidth
                  disabled={!selectedAgent || selectedAgent.trim().length === 0}
                  classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
                >
                  Transfer Ticket
                </Button>
              </section>
            </Tabs.Panel>
          )}

          {/* Status Tab Panel - sab ke liye accessible */}
          <Tabs.Panel value="status">
            <Title
              my={"md"}
              ta={"center"}
              classNames={{ root: "!text-heading" }}
              order={3}
            >
              Update Ticket Status
            </Title>

            <section className="flex items-center justify-center flex-col gap-3">
              <Select
                classNames={{ root: "!w-full", label: "mb-1" }}
                label="Select Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                data={[
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
                radius={"md"}
                placeholder="Select status"
              />
              <Button
                radius="md"
                fullWidth
                loading={ticketStatusMutation.isPending}
                loaderProps={{ type: "bars" }}
                disabled={
                  selectedStatus?.trim("")?.length <= 0 ||
                  selectedStatus === null
                }
                onClick={() =>
                  ticketStatusMutation.mutate({
                    ticketId: selectedTicket.id,
                    status: selectedStatus,
                  })
                }
                classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
              >
                Update Status
              </Button>
            </section>
          </Tabs.Panel>

          {/* Priority Tab Panel - sirf admin ke liye */}
          {userRole === "admin" && (
            <Tabs.Panel value="priority">
              <Title
                my={"md"}
                ta={"center"}
                classNames={{ root: "!text-heading" }}
                order={3}
              >
                Update Ticket Priority
              </Title>

              <section className="flex items-center justify-center flex-col gap-3">
                <Select
                  value={selectedPriority}
                  onChange={setSelectedPrority}
                  data={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                    { value: "critical", label: "Critical" },
                  ]}
                  classNames={{ root: "!w-full", label: "mb-1" }}
                  label="Select Priority"
                  radius={"md"}
                  placeholder="Select Priority"
                />
                <Button
                  radius="md"
                  fullWidth
                  loading={ticketPriorityMutation.isPending}
                  loaderProps={{ type: "bars" }}
                  disabled={
                    selectedPriority?.trim("")?.length <= 0 ||
                    selectedPriority === null
                  }
                  onClick={() =>
                    ticketPriorityMutation.mutate({
                      ticketId: selectedTicket.id,
                      priority: selectedPriority,
                    })
                  }
                  classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
                >
                  Update Priority
                </Button>
              </section>
            </Tabs.Panel>
          )}
        </Tabs>
      </Modal>
    </>
  );
}
