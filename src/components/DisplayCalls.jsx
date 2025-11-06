import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FaTrashAlt } from "react-icons/fa";
import { RxCheck, RxCross2 } from "react-icons/rx";
import CustomerSatisfactionToggler from "./CustomerSatisfactionToggler";

export default function DisplayCalls({ calls, selectedCall, setSelectedCall }) {
  const queryClient = useQueryClient();
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  // Delete Call using TanStack Query
  const deleteCallMutation = useMutation({
    mutationFn: (callId) => {
      return apiClient.delete(`/api/call/${callId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["calls"]); // Refetch users after success
      closeDeleteModal(); // Close modal

      notifications.show({
        title: "Success",
        message: "Call deleted successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Error deleting Call:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to delete call",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const handleDeleteCall = () => {
    if (selectedCall.id) {
      deleteCallMutation.mutate(selectedCall.id);
    }
  };
  useEffect(() => {
    if (calls?.length > 0) {
      setSelectedCall(calls[0]);
    }
  }, [calls]);

  return (
    <>
      <section className="flex gap-x-4 ">
        {/* Calls Table */}
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full  divide-y divide-gray-200">
            <thead className="bg-primary sticky top-0 left-0 z-30">
              <tr>
                {["Sr. No", "User Name", "Type", "AI Resolution"].map(
                  (dataVal) => (
                    <th
                      key={dataVal}
                      className={`${
                        dataVal === "Sr. No" ? "rounded-tl-2xl" : "text-left"
                      } ${
                        dataVal === "AI Resolution"
                          ? "rounded-tr-2xl"
                          : "text-left"
                      } px-6 py-4 text-sm font-semibold tracking-wider text-white`}
                    >
                      {dataVal}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {calls?.map((call, index) => (
                <tr
                  key={call.id}
                  className={`hover:bg-primary/20 cursor-pointer text-left transition duration-200 ease-in-out ${
                    selectedCall?.id === call.id ? "bg-primary/20" : ""
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/4">
                    {index + 1}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/5">
                  {call.userId || "N/A"}
                </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/4">
                    {call?.userId?.name || call?.User?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize w-1/4">
                    {call.type}
                    {call.callCategory ? ` - ${call.callCategory}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.isResolvedByAi
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {call.isResolvedByAi ? "Resolved" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Sidebar - Minimal Info */}
        <section className="w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {selectedCall ? (
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Call Details
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCall.isResolvedByAi
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedCall.isResolvedByAi ? "RESOLVED" : "PENDING"}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Call Summary */}
                {selectedCall.summary && (
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
                        {selectedCall.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Basic Call Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        Type
                      </p>
                      <p className="text-xs font-semibold text-gray-900 mt-1 capitalize">
                        {selectedCall.type || "N/A"}
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        User Name
                      </p>
                      <p className="text-xs font-semibold text-gray-900 mt-1">
                        {selectedCall?.userId?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Languages */}
                  {selectedCall.languages &&
                    selectedCall.languages.length > 0 && (
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                          Languages
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedCall.languages.map((lang, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded text-xs text-gray-700 border"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Call Summary */}

                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
                    User Satisfaction
                  </h4>

                  <CustomerSatisfactionToggler
                    callId={selectedCall.id}
                    initialSatisfied={selectedCall.customerSatisfied}
                  />
                </div>

                {/* Timestamps */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Created</span>
                    <span className="text-gray-700">
                      {selectedCall.createdAt
                        ? new Date(selectedCall.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      Last Updated
                    </span>
                    <span className="text-gray-700">
                      {selectedCall.updatedAt
                        ? new Date(selectedCall.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t flex gap-2 border-gray-200 p-4 bg-gray-50">
                <Link to={`/calls/${selectedCall.id}`} className="flex-1">
                  <Button
                    radius="md"
                    size="sm"
                    fullWidth
                    classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
                  >
                    View Details
                  </Button>
                </Link>

                <Button
                  radius="md"
                  size="sm"
                  onClick={openDeleteModal}
                  leftSection={<FaTrashAlt />}
                  color="red"
                >
                  Delete
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-gray-500 text-sm font-medium">
                  Select a call to view details
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Click on any row in the table
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      {/* Modal for delete Call confirmation */}

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
        <Text mb="md">Are you sure you want to delete this call?</Text>
        <Group position="right" mt="md">
          <Button
            variant="outline"
            radius="md"
            size="sm"
            onClick={closeDeleteModal}
            disabled={deleteCallMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            radius="md"
            size="sm"
            onClick={handleDeleteCall}
            loading={deleteCallMutation.isPending}
            disabled={deleteCallMutation.isPending}
            loaderProps={{ type: "bars" }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
