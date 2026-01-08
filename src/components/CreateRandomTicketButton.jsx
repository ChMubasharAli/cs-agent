import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Button,
  Modal,
  Select,
  TextInput,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { FaPlusCircle } from "react-icons/fa";
import apiClient from "../api/axios";
import { notifications } from "@mantine/notifications";
import { RxCheck, RxCross2 } from "react-icons/rx";

const CreateRandomTicketButton = ({ userId }) => {
  // Modal state
  const [opened, { open, close }] = useDisclosure(false);

  // Form state
  const [formData, setFormData] = useState({
    status: "open",
    ticketType: "support",
    priority: "high",
    summary: "",
    proposedSolution: "",
    userId: userId,
    agentId: "",
  });

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const response = await apiClient.get(`/api/agents`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching agents:", error);
      return [];
    }
  };

  const { data: agents = [], isLoading: isLoadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  // Create ticket
  const createTicket = async (ticketData) => {
    const response = await apiClient.post(`/api/tickets`, ticketData);
    return response.data;
  };

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      // Close modal and reset form
      close();
      setFormData({
        status: "open",
        ticketType: "support",
        priority: "high",
        summary: "",
        proposedSolution: "",
        userId: userId,
        agentId: "",
      });

      // Show success message
      notifications.show({
        title: "Success",
        message: "Ticket created successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to create ticket. Please try again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agentId) {
      alert("Please select an agent");
      return;
    }
    createTicketMutation.mutate(formData);
  };

  // Prepare agents for dropdown
  const agentOptions = agents
    .filter((agent) => agent.isActive)
    .map((agent) => ({
      value: agent.id.toString(),
      label: `${agent.firstName} ${agent.lastName}`,
    }));

  return (
    <>
      {/* Button to open modal */}
      <Button
        onClick={open}
        leftSection={<FaPlusCircle size={14} />}
        radius="md"
        size="sm"
        classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
      >
        Create Ticket
      </Button>

      {/* Modal */}
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={close}
        title="Create New Ticket"
        size="md"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
        centered
        radius="lg"
      >
        <form onSubmit={handleSubmit}>
          <LoadingOverlay
            visible={isLoadingAgents || createTicketMutation.isLoading}
          />

          {/* Agent Selection */}
          <Select
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Select Agent"
            placeholder="Choose an agent"
            data={agentOptions}
            value={formData.agentId}
            onChange={(value) => handleChange("agentId", value)}
            required
            searchable
            mb="md"
          />

          {/* Ticket Type */}
          <Select
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Ticket Type"
            data={[
              { value: "support", label: "Support" },
              { value: "sales", label: "Sales" },
              { value: "billing", label: "Billing" },
            ]}
            value={formData.ticketType}
            onChange={(value) => handleChange("ticketType", value)}
            mb="md"
          />

          {/* Priority */}
          <Select
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Priority"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
            value={formData.priority}
            onChange={(value) => handleChange("priority", value)}
            mb="md"
          />

          {/* Status */}
          <Select
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Status"
            data={[
              { value: "open", label: "Open" },
              { value: "in-progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
            value={formData.status}
            onChange={(value) => handleChange("status", value)}
            mb="md"
          />

          {/* Summary */}
          <TextInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Summary"
            placeholder="Enter summary"
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            required
            mb="md"
          />

          {/* Proposed Solution */}
          <Textarea
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Proposed Solution"
            placeholder="Enter proposed solution"
            value={formData.proposedSolution}
            onChange={(e) => handleChange("proposedSolution", e.target.value)}
            minRows={3}
            mb="md"
          />

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createTicketMutation.isLoading}
              disabled={!formData.agentId}
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateRandomTicketButton;
