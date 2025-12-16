import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaPlusCircle,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Select,
  Group,
  Avatar,
  Rating,
  Box,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { RxCross2, RxCheck } from "react-icons/rx";
import { LoaderComp } from "../../components";
import { notifications } from "@mantine/notifications";
import apiClient from "../../api/axios";

// API functions using Axios

// Fetch all agents from the database
const fetchAgents = async () => {
  try {
    const response = await apiClient.get(`/api/agents`);
    // Ensure the response data is an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return []; // Return empty array on error to prevent map issues
  }
};

// Create a new agent
const createAgent = async (agentData) => {
  const response = await apiClient.post(`/api/agents`, agentData);
  return response.data;
};

// Update an existing agent
const updateAgent = async ({ id, agentData }) => {
  const response = await apiClient.put(`/api/agents/${id}`, agentData);
  return response.data;
};

// Delete an agent
const deleteAgent = async (id) => {
  const response = await apiClient.delete(`/api/agents/${id}`);
  return response.data;
};

const Agents = () => {
  const queryClient = useQueryClient();

  // Fetch agents using TanStack Query
  const {
    data: agents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  // State for modal visibility and mode ('create' or 'edit')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  // State for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAgentId, setDeletingAgentId] = useState(null);

  // Initial form data
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ticketType: "",
  };

  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // Options for ticketType dropdown
  const ticketTypeOptions = [
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "billing", label: "Billing" },
  ];

  // Fetch agent ratings with TanStack Query v5
  const {
    data: agentRatings,
    isLoading: isRatingsLoading,
    error: ratingsError,
    refetch: fetchRatings,
  } = useQuery({
    queryKey: ["agentRatings", selectedAgent?.id],
    queryFn: async ({ queryKey }) => {
      const agentId = queryKey[1];

      if (!agentId) {
        console.error("Cannot fetch ratings: No agent ID provided");
        throw new Error("Agent ID is required to fetch ratings");
      }

      console.log("Fetching ratings for agent ID:", agentId);
      const response = await apiClient.get(`/api/agents/${agentId}/ratings`);
      return response.data;
    },
    enabled: false, // We'll manually trigger this when modal opens
  });

  // Trigger ratings fetch when modal opens and agent is selected
  useEffect(() => {
    if (isRatingModalOpen && selectedAgent?.id) {
      console.log("Fetching ratings for agent:", selectedAgent.id);
      fetchRatings();
    }
  }, [isRatingModalOpen, selectedAgent?.id]);

  // Mutation for creating a new agent
  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(["agents"]); // Refetch agents after success
      setIsModalOpen(false); // Close modal
      setFormData(initialFormData); // Reset form

      // Show success notification
      notifications.show({
        title: "Success",
        message: "Agent created successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to create agent. Please try again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Mutation for updating an agent
  const updateMutation = useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(["agents"]); // Refetch agents after success
      setIsModalOpen(false); // Close modal
      setFormData(initialFormData); // Reset form
      // Show success notification
      notifications.show({
        title: "Success",
        message: "Agent updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to Update agent. Please try again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Mutation for deleting an agent
  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(["agents"]); // Refetch agents after success
      setIsDeleteModalOpen(false); // Close delete confirmation modal
      setDeletingAgentId(null); // Clear deleting agent ID
      // Show success notification
      notifications.show({
        title: "Success",
        message: "Agent Deleted successfully",
        position: "top-right",
        icon: <RxCheck size={18} />,
        color: "green",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error deleting agent:", error);
      setIsDeleteModalOpen(false); // Close delete confirmation modal
      setDeletingAgentId(null); // Clear deleting agent ID
      // Show error notification
      notifications.show({
        title: "Error",
        message: "Failed to delete agent. Please try again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Function to open modal in create or edit mode
  const handleOpenModal = (mode = "create", agent = null) => {
    setModalMode(mode);
    if (mode === "edit" && agent) {
      setFormData({
        id: agent.id,
        firstName: agent.firstName || "",
        lastName: agent.lastName || "",
        email: agent.email || "",
        password: "", // Empty password field for edit mode
        ticketType: agent.ticketType || "",
        role: agent.role || "agent",
      });
    } else {
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
  };

  // Function to open rating modal
  const handleOpenRatingModal = (agent) => {
    console.log("Opening rating modal for agent ID:", agent?.id);
    setSelectedAgent(agent);
    setIsRatingModalOpen(true);

    // Clear previous ratings data for this agent
    if (agent?.id) {
      queryClient.setQueryData(["agentRatings", agent.id], undefined);
    }
  };

  // Function to close rating modal
  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedAgent(null);
  };

  // Function to open delete confirmation modal
  const handleOpenDeleteModal = (id) => {
    setDeletingAgentId(id);
    setIsDeleteModalOpen(true);
  };

  // Function to close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAgentId(null);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target || {
      name: e.currentTarget.name,
      value: e.currentTarget.value,
    };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: formData.id, agentData: formData });
    }
  };

  // Function to handle edit button click
  const handleEdit = (agent) => {
    handleOpenModal("edit", agent);
  };

  // Function to handle delete button click
  const handleDelete = () => {
    if (deletingAgentId) {
      deleteMutation.mutate(deletingAgentId);
    }
  };

  return (
    <div className=" container mx-auto">
      {/* Header Section */}
      <div className="flex justify-end">
        <Button
          my={"md"}
          radius="md"
          size="sm"
          onClick={() => handleOpenModal("create")}
          leftSection={<FaPlusCircle size={14} />}
          classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
        >
          Create Agent
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          {isLoading ? (
            <LoaderComp />
          ) : error ? (
            <Text py={"md"} ta={"center"} c={"red"}>
              Failed to load agents: {error.message}
            </Text>
          ) : !Array.isArray(agents) || agents.length === 0 ? (
            <Text py={"md"} ta={"center"}>
              No agents found.
            </Text>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  {[
                    "Avatar",
                    "Name",
                    "Email",
                    "Type",
                    "Avg Rating",
                    "Actions",
                  ].map((dataVal) => (
                    <th
                      key={dataVal}
                      className={`px-6 py-4 ${
                        dataVal === "Actions" ? "text-center" : "text-left"
                      } text-sm font-semibold text-white   tracking-wider`}
                    >
                      {dataVal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {agents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-primary/5 text-left transition duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 w-1/6">
                      <Avatar color="blue" radius="xl">
                        {agent.firstName.charAt(0).toUpperCase()}
                        {agent.lastName.charAt(0).toUpperCase()}
                      </Avatar>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm font-medium text-gray-900 w-1/6">
                      {`${agent.firstName} ${agent.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/6">
                      {agent.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/6">
                      {agent.ticketType}
                    </td>
                    <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-600 w-1/6">
                      <Button
                        title="Show Rating"
                        variant="light"
                        color="green"
                        radius={"md"}
                        className="cursor-pointer"
                        rightSection={<FaExpandArrowsAlt />}
                        onClick={() => handleOpenRatingModal(agent)}
                      >
                        <Rating
                          defaultValue={agent.averageRating}
                          count={5}
                          readOnly
                        />
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500 w-1/6">
                      <div className="flex justify-center gap-2 ">
                        <Button
                          onClick={() => handleEdit(agent)}
                          title="Edit"
                          variant="light"
                          size="xs"
                          className="group"
                          px={"xs"}
                        >
                          <FaPencilAlt className="group-hover:!scale-115 duration-300 transition-all ease-in-out" />
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => handleOpenDeleteModal(agent.id)}
                          title="Delete"
                          variant="light"
                          c={"red"}
                          px={"xs"}
                          className="group"
                        >
                          <FaTrashAlt className="group-hover:!scale-115 duration-300 transition-all ease-in-out" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Agent using Mantine UI */}
      <Modal
        closeOnClickOutside={false}
        opened={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === "create" ? "Create Agent" : "Update Agent"}
        size="md"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
        centered
        radius="lg"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="First Name"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleInputChange}
            required={modalMode === "create" ? true : false}
            mb="md"
          />
          <TextInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Last Name"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleInputChange}
            required={modalMode === "create" ? true : false}
            mb="md"
          />
          <TextInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required={modalMode === "create" ? true : false}
            mb="md"
          />
          <PasswordInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required={modalMode === "create" ? true : false}
            mb="md"
          />
          <Select
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Agent Type"
            name="ticketType"
            value={formData.ticketType}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, ticketType: value }))
            }
            data={ticketTypeOptions}
            required={modalMode === "create" ? true : false}
            mb="md"
            placeholder="Select agent type"
          />
          <div className="flex items-center justify-end gap-4">
            <Button
              classNames={{
                root: "!bg-transparent !border !border-primary !text-primary",
              }}
              radius="md"
              size="sm"
              onClick={handleCloseModal}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              loaderProps={{ type: "bars" }}
              radius="md"
              size="sm"
              classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
            >
              {modalMode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Agent Ratings */}
      <Modal
        opened={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        title={
          selectedAgent
            ? `${selectedAgent.firstName} ${selectedAgent.lastName}'s Ratings`
            : "Agent Ratings"
        }
        size="lg"
        centered
        radius="lg"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary",
        }}
      >
        {isRatingsLoading ? (
          <div className="flex justify-center py-12">
            <LoaderComp />
          </div>
        ) : ratingsError ? (
          <div className="text-center py-8">
            <Text c="red" mb="md">
              Failed to load ratings
            </Text>
            <Button onClick={() => fetchRatings()} variant="light">
              Try Again
            </Button>
          </div>
        ) : agentRatings ? (
          <Box>
            {/* Ticket Statistics */}
            {agentRatings.ticketStats && (
              <Box mb="lg" className="bg-gray-50 p-4 rounded-lg">
                <Text fw={600} mb="sm">
                  Ticket Statistics
                </Text>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Box>
                    <Text size="sm" c="dimmed">
                      Total Tickets
                    </Text>
                    <Text fw={700} size="lg">
                      {agentRatings.ticketStats.totalTickets}
                    </Text>
                  </Box>
                  {agentRatings.ticketStats.statusCounts &&
                    Object.entries(agentRatings.ticketStats.statusCounts).map(
                      ([status, count]) => (
                        <Box key={status}>
                          <Text size="sm" c="dimmed" tt="capitalize">
                            {status.replace("_", " ")}
                          </Text>
                          <Text fw={700} size="lg">
                            {count}
                          </Text>
                        </Box>
                      )
                    )}
                </div>
              </Box>
            )}

            {/* Ratings Cards/Blocks */}
            {agentRatings.ratings && agentRatings.ratings.length > 0 ? (
              <ScrollArea h={400} type="auto">
                <div className="space-y-4">
                  {agentRatings.ratings.map((rating) => (
                    <Box
                      key={rating.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      {/* Rating Score and Comments */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Rating value={rating.score} readOnly />
                            <Text size="sm" fw={500} c="dimmed">
                              ({rating.score}/5)
                            </Text>
                          </div>
                        </div>
                        <Badge
                          color={
                            rating.Ticket?.status === "open"
                              ? "blue"
                              : rating.Ticket?.status === "in_progress"
                              ? "yellow"
                              : rating.Ticket?.status === "resolved"
                              ? "green"
                              : "gray"
                          }
                          variant="light"
                          tt="capitalize"
                        >
                          {rating.Ticket?.status?.replace("_", " ") || "N/A"}
                        </Badge>
                      </div>

                      {/* Ticket Summary */}
                      <Box className="mb-3">
                        <Text fw={500} size="sm" mb={"xs"}>
                          Comments:
                        </Text>
                        <Text
                          size="sm"
                          p={"sm"}
                          className="text-gray-700 bg-white !w-full  rounded border border-gray-100"
                        >
                          {rating.comments}
                        </Text>
                      </Box>
                      <Box className="mb-3">
                        <Text fw={500} size="sm" mb={"xs"}>
                          Ticket Summary:
                        </Text>
                        <Text
                          size="sm"
                          p={"sm"}
                          className="text-gray-700 bg-white  rounded border border-gray-100"
                        >
                          {rating.Ticket?.summary || "No summary available"}
                        </Text>
                      </Box>

                      {/* User Details */}
                      <Box className="bg-white p-3 rounded border border-gray-100">
                        <Text fw={500} size="sm" mb={"md"}>
                          User Details:
                        </Text>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Box>
                            <Text size="xs" c="dimmed">
                              Name
                            </Text>
                            <Text size="sm" fw={500}>
                              {rating.User?.name || "N/A"}
                            </Text>
                          </Box>

                          <Box>
                            <Text size="xs" c="dimmed">
                              Phone
                            </Text>
                            <Text size="sm" fw={500}>
                              {rating.User?.phone || "N/A"}
                            </Text>
                          </Box>
                          <Box className=" col-span-2">
                            <Text size="xs" c="dimmed">
                              Email
                            </Text>
                            <Text size="sm" fw={500}>
                              {rating.User?.email || "N/A"}
                            </Text>
                          </Box>
                        </div>
                      </Box>

                      {/* Date */}
                      <Box className="mt-3 pt-3 border-t border-gray-200">
                        <Text size="xs" c="dimmed">
                          Created:{" "}
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Box className="text-center py-8">
                <Text c="dimmed">No ratings found for this agent.</Text>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="text-center py-8">
            <Text c="dimmed">No rating data available.</Text>
          </Box>
        )}
      </Modal>

      {/* Modal for Delete Confirmation using Mantine UI */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        size="sm"
        centered
        radius="lg"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary",
        }}
      >
        <Text mb="md">Are you sure you want to delete this agent?</Text>
        <Group position="right" mt="md">
          <Button
            variant="outline"
            radius="md"
            size="sm"
            onClick={handleCloseDeleteModal}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            radius="md"
            size="sm"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            loaderProps={{ type: "bars" }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default Agents;
