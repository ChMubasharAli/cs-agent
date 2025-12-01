import React, { useState } from "react";
import { LoaderComp } from "../../components";
import { Button, Modal, Select, Tabs, Text, Title, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { RxCheck, RxCross2 } from "react-icons/rx";
import apiClient from "../../api/axios";
import DisplayCalls from "../../components/DisplayCalls";

export default function AgentCalls() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Frontend pagination ke liye

  const queryClient = useQueryClient();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // Fetch Calls with Pagination using TanStack Query v5
  const {
    data: callsResponse = {},
    isLoading: callsLoading,
    error: callsError,
  } = useQuery({
    queryKey: ["calls", userData?.id],
    queryFn: () => {
      return apiClient
        .get(`api/call/${userData.id}/agent`) // Fixed to plural
        .then((response) => response.data);
    },
    placeholderData: keepPreviousData,
    enabled: !!userData?.id,
  });

  const calls = Array.isArray(callsResponse) ? callsResponse : [];

  // Frontend Pagination Logic
  const totalCalls = calls.length || 0;
  const totalPages = Math.ceil(totalCalls / itemsPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  // Current page ke calls calculate karein
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = calls.slice(startIndex, endIndex);

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

  // Update Call Status Mutation
  const updateCallStatusMutation = useMutation({
    mutationFn: ({ callId, isResolved }) => {
      return apiClient.patch(`/api/call/${callId}/status`, {
        isResolvedByAi: isResolved,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      close();
      setSelectedStatus(""); // Reset selection
      notifications.show({
        title: "Success",
        message: "Call status updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error updating call status:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to update call status",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const handleUpdateStatus = () => {
    if (!selectedCall || !selectedStatus) {
      notifications.show({
        title: "Error",
        message: "Please select a status",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    updateCallStatusMutation.mutate({
      callId: selectedCall.id,
      isResolved: selectedStatus === "true",
    });
  };

  const handleModalClose = () => {
    close();
    setSelectedStatus("");
  };

  return (
    <>
      <main className="py-4 container mx-auto ">
        {callsLoading ? (
          <LoaderComp />
        ) : callsError ? (
          <Text py={"md"} ta={"center"} c={"red"}>
            Failed to load Calls: {callsError.message}
          </Text>
        ) : !Array.isArray(calls) || calls.length === 0 ? (
          <Text py={"md"} ta={"center"}>
            No calls found.
          </Text>
        ) : (
          <section className="h-full bg-white rounded-2xl p-2 flex flex-col">
            {/* Calls Table Section */}
            <div className="flex-1">
              <DisplayCalls
                calls={currentCalls} // Current page ke calls pass karein
                modalOpen={open}
                selectedCall={selectedCall}
                setSelectedCall={setSelectedCall}
              />
            </div>

            {/* Pagination Section - Exact same design as other components */}
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
                Page {currentPage} of {totalPages} • {totalCalls} total calls
              </Text>
            </div>
          </section>
        )}
      </main>

      {/* Modal for Update Call */}
      <Modal
        opened={opened}
        onClose={handleModalClose}
        centered
        size={"md"}
        closeOnClickOutside={false}
        overlayProps={{ opacity: 1 }}
        title="Update Call"
        classNames={{
          title: "text-heading !text-xl !font-semibold",
          close: "hover:!text-primary !border-none !outline-primary",
        }}
        radius="lg"
      >
        <div className="space-y-4">
          <Title
            my={"md"}
            ta={"center"}
            classNames={{ root: "!text-heading" }}
            order={3}
          >
            Update Call Status
          </Title>

          <Select
            classNames={{ root: "!w-full", label: "mb-1" }}
            label="AI Resolution Status"
            data={[
              { value: "true", label: "Resolved by AI" },
              { value: "false", label: "Pending Resolution" },
            ]}
            value={selectedStatus}
            onChange={setSelectedStatus}
            radius="md"
            placeholder="Select status"
          />

          <Button
            radius="md"
            fullWidth
            loading={updateCallStatusMutation.isPending}
            loaderProps={{ type: "bars" }}
            onClick={handleUpdateStatus}
            disabled={!selectedCall || !selectedStatus}
            classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
          >
            Update Status
          </Button>
        </div>
      </Modal>
    </>
  );
}
