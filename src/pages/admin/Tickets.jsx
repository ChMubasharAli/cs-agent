import React, { useState } from "react";
import { LoaderComp, DisplayTickets } from "../../components";
import { Button, Modal, Select, Tabs, Text, Title } from "@mantine/core";
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

  const queryClient = useQueryClient();

  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPrority] = useState("");

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
      <main className="py-4 container mx-auto min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-100px)]   ">
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
          <section className="h-full bg-white rounded-2xl p-2">
            <DisplayTickets
              route={route}
              tickets={ticketsData}
              modalOpen={open}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
            />
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

        <Tabs defaultValue="transfer" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="transfer">Transfer</Tabs.Tab>
            <Tabs.Tab value="status">Status</Tabs.Tab>
            <Tabs.Tab value="priority">Priority</Tabs.Tab>
          </Tabs.List>

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
                data={["open", "in_progress", "resolved", "closed"]}
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
                classNames={{ root: "!w-full", label: "mb-1" }}
                label="Select Priority"
                data={["low", "medium", "high", "critical"]}
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
        </Tabs>
      </Modal>
    </>
  );
}
