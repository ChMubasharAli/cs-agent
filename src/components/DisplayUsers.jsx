import { Button } from "@mantine/core";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

export default function Displayusers({
  users,
  selectedUser,
  setSelectedUser,
  statusModalOpen,
  deleteModalOpen,
}) {
  // Get the latest selected user data from the users array
  const currentSelectedUser =
    users.find((user) => user.id === selectedUser?.id) || selectedUser;

  return (
    <section className="flex gap-x-4 h-full min-h-[85vh]   ">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary sticky  top-0 left-0 z-30">
            <tr>
              {["Sr. No", "Name", "Email", "Phone", "Role"].map((dataVal) => (
                <th
                  key={dataVal}
                  className={`${
                    dataVal === "Sr. No" ? "rounded-tl-2xl" : "text-left"
                  } ${
                    dataVal === "Role" ? "rounded-tr-2xl" : "text-left"
                  } px-6 py-4 text-sm font-semibold  tracking-wider text-white`}
                >
                  {dataVal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users?.map((user, index) => (
              <tr
                key={user.id}
                className={`hover:bg-primary/20 cursor-pointer text-left transition duration-200 ease-in-out ${
                  selectedUser?.id === user.id ? "bg-primary/20" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/5">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-600 w-1/5">
                  {user?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/5">
                  {user?.email || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 w-1/5">
                  {user?.phone || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize w-1/5">
                  {user?.role || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right section - Use currentSelectedUser instead of selectedUser */}
      <section className="w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {currentSelectedUser ? (
          <div className="h-full flex flex-col">
            <div className="bg-gradient-to-r from-primary to-primary-hover px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  User Details
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentSelectedUser.status === "active"
                      ? "bg-green-100 text-green-800"
                      : currentSelectedUser.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSelectedUser.status?.toUpperCase() || "PENDING"}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3 text-center tracking-wider">
                  User Information
                </h4>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-900 mb-1 tracking-wider">
                    Name:{" "}
                    <span className="font-normal text-xs">
                      {currentSelectedUser?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-xs mb-1 font-medium text-gray-900 tracking-wider">
                    Email:{" "}
                    <span className="font-normal text-xs">
                      {currentSelectedUser?.email || "N/A"}
                    </span>
                  </p>
                  <p className="text-xs mb-1 font-medium text-gray-900 tracking-wider">
                    Phone:{" "}
                    <span className="font-normal text-xs">
                      {currentSelectedUser?.phone || "N/A"}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-900 tracking-wider">
                    Role:{" "}
                    <span className="font-normal text-xs capitalize">
                      {currentSelectedUser?.role || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Call Type
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1">
                      {currentSelectedUser.isSatisfactionCall
                        ? "Satisfaction"
                        : currentSelectedUser.isUpSellCall
                        ? "Upsell"
                        : currentSelectedUser.isBothCall
                        ? "Both"
                        : "General"}
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-xs font-semibold text-gray-900 mt-1 capitalize">
                      {currentSelectedUser.status || "Active"}
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-xs mb-2 font-medium text-primary uppercase tracking-wide">
                    Call Preferences
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upsell Call:</span>
                      <span
                        className={`font-medium ${
                          currentSelectedUser.isUpSellCall
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {currentSelectedUser.isUpSellCall ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfaction Call:</span>
                      <span
                        className={`font-medium ${
                          currentSelectedUser.isSatisfactionCall
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {currentSelectedUser.isSatisfactionCall ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Both Calls:</span>
                      <span
                        className={`font-medium ${
                          currentSelectedUser.isBothCall
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {currentSelectedUser.isBothCall ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Created</span>
                  <span className="text-gray-700">
                    {currentSelectedUser.createdAt
                      ? new Date(
                          currentSelectedUser.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    Last Updated
                  </span>
                  <span className="text-gray-700">
                    {currentSelectedUser.updatedAt
                      ? new Date(
                          currentSelectedUser.updatedAt
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
                onClick={() => statusModalOpen()}
                fullWidth
                leftSection={<FaRegEdit size={16} />}
                classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
              >
                Update User
              </Button>
              <Button
                radius="md"
                size="sm"
                color="red"
                onClick={() => deleteModalOpen()}
                fullWidth
                leftSection={<FaTrashAlt />}
              >
                Delete User
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
                Select a user to view details
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
