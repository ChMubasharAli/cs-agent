import { useState } from "react";
import { Button, Group, Modal, Select, Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RxCheck, RxCross2 } from "react-icons/rx";
import apiClient from "../../api/axios";
import Displayusers from "../../components/DisplayUsers";
import { LoaderComp } from "../../components";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

export default function Users({ apiKey = "/api/users" }) {
  const queryClient = useQueryClient();

  const [
    statusModalOpened,
    { open: openStatusModal, close: closeStatusModal },
  ] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Frontend pagination ke liye

  // Fetch All Users using TanStack Query
  const {
    data: usersData = [],
    isLoading: ticketFetchingLoading,
    error: ticketFetchingError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return apiClient.get(apiKey).then((response) => response.data);
    },
  });

  // Frontend Pagination Logic
  const totalUsers = usersData.length || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  // Current page ke users calculate karein
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = usersData.slice(startIndex, endIndex);

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

  // Update User status using TanStack Query
  const userStatusMutation = useMutation({
    mutationFn: ({ userId, status }) => {
      return apiClient.patch(`/api/users/${userId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refetch users after success
      closeStatusModal(); // Close modal
      setSelectedStatus(""); // Reset status

      notifications.show({
        title: "Success",
        message: "User status updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error updating User status:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to update user status",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  // Delete User using TanStack Query
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => {
      return apiClient.delete(`/api/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // Refetch users after success
      closeDeleteModal(); // Close modal
      setSelectedUser(null); // Clear selected user

      notifications.show({
        title: "Success",
        message: "User deleted successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to delete user",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  return (
    <>
      <main className="py-4 container mx-auto ">
        {ticketFetchingLoading ? (
          <LoaderComp />
        ) : ticketFetchingError ? (
          <Text py={"md"} ta={"center"} c={"red"}>
            Failed to load Users: {ticketFetchingError.message}
          </Text>
        ) : !Array.isArray(usersData) || usersData.length === 0 ? (
          <Text py={"md"} ta={"center"}>
            No users found.
          </Text>
        ) : (
          <section className="h-full bg-white rounded-2xl p-2 flex flex-col shadow-lg">
            {/* Users Table Section */}
            <div className="flex-1">
              <Displayusers
                statusModalOpen={openStatusModal}
                deleteModalOpen={openDeleteModal}
                users={currentUsers} // Current page ke users pass karein
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
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
                Page {currentPage} of {totalPages} • {totalUsers} total users
              </Text>
            </div>
          </section>
        )}
      </main>

      {/* Modal for update user status */}
      <Modal
        opened={statusModalOpened}
        onClose={closeStatusModal}
        centered
        size={"lg"}
        closeOnClickOutside={false}
        overlayProps={{ opacity: 1 }}
        title="Update User Status"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
        radius="lg"
      >
        <section className="flex items-center justify-center flex-col gap-3">
          <Select
            classNames={{ root: "!w-full", label: "mb-1" }}
            label="Select Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            data={["active", "inactive", "pending"]}
            radius={"md"}
            placeholder="Select status"
          />
          <Button
            radius="md"
            fullWidth
            loading={userStatusMutation.isPending}
            loaderProps={{ type: "bars" }}
            disabled={
              selectedStatus?.trim("")?.length <= 0 || selectedStatus === null
            }
            onClick={() =>
              userStatusMutation.mutate({
                userId: selectedUser.id,
                status: selectedStatus,
              })
            }
            classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
          >
            Update Status
          </Button>
        </section>
      </Modal>

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
        <Text mb="md">Are you sure you want to delete this user?</Text>
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
