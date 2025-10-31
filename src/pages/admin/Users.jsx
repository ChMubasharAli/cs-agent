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
      <main className="py-4 container mx-auto min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-100px)]">
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
          <section className="h-full bg-white rounded-2xl p-2">
            <Displayusers
              statusModalOpen={openStatusModal}
              deleteModalOpen={openDeleteModal}
              users={usersData}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
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
