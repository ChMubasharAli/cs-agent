import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mantine/core";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import TicketNotes from "./TicketNotes";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import axios from "axios";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const {
    data: ticket = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () =>
      apiClient.get(`/api/ticket/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });

  // Simple email sending function
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailSubject.trim() || !emailBody.trim()) {
      alert("Please fill in both subject and message fields");
      return;
    }

    setIsSending(true);

    try {
      const emailData = {
        email: ticket.User?.email,
        subject: emailSubject,
        body: emailBody,
        userId: ticket.userId,
      };

      await axios.post("http://csagentbackend.getpie.io/email", emailData);

      // Refresh the ticket data to show the new email
      queryClient.invalidateQueries(["ticket", id]);
      notifications.show({
        title: "Success",
        message: "Email sent successfully!",
        color: "green", // primary
        position: "top-right",
        autoClose: 4000,
      });
      // Reset form
      setEmailSubject("");
      setEmailBody("");
    } catch (error) {
      console.error("Failed to send email:", error);
      notifications.show({
        title: "Error",
        message: "Failed to send email. Try again",
        color: "red", // accent
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading ticket details...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-xl font-semibold text-gray-900 mb-2">
          Ticket Not Found
        </p>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          classNames={{ root: "!bg-blue-600 hover:!bg-blue-700" }}
        >
          Back to Tickets
        </Button>
      </div>
    );

  return (
    <div className="bg-white py-8 rounded-xl shadow-md">
      {/* Main Card */}
      <div className="bg-white container mx-auto">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ticket #{ticket.id}
              </h1>
              <p className="text-gray-600 text-sm">
                Customer Support Case Details
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status?.replace("_", " ").toUpperCase()}
              </span>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority?.toUpperCase() || "MEDIUM"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Email Communication */}
              {ticket.emails && ticket.emails.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Email Communication
                  </h2>

                  {/* Email Thread with Scroll */}
                  <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {ticket.emails.map((email) => (
                        <div
                          key={email.id}
                          className={`border rounded-lg p-4 ${
                            email.isRecieved
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${
                                  email.isRecieved
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                                }`}
                              ></div>
                              <span className="text-sm font-semibold text-gray-700">
                                {email.isRecieved ? "Received" : "Sent"}
                              </span>
                              <span className="text-sm text-gray-500">
                                from: {email.from}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {formatDate(email.date)}
                            </span>
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {email.subject}
                            </h4>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {email.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation History */}
              {ticket.Calls && ticket.Calls.length > 0 && (
                <div className="space-y-4  h-full">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Conversation History
                  </h2>
                  {ticket.Calls.map((call, index) => (
                    <div
                      key={call.id}
                      className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 h-96 overflow-y-auto"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-semibold text-gray-700">
                          Call {index + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(call.createdAt)}
                        </span>
                      </div>

                      {call.QuestionsAnswers &&
                        call.QuestionsAnswers.length > 0 && (
                          <div className="space-y-4">
                            {call.QuestionsAnswers.map((qa, qaIndex) => (
                              <div key={qaIndex} className="space-y-3">
                                {qa.q && (
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-gray-500 mb-1">
                                        Customer Question
                                      </p>
                                      <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg leading-relaxed">
                                        {qa.q}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {qa.a && (
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                      <p className="text-xs font-semibold text-gray-500 mb-1">
                                        Agent Response
                                      </p>
                                      <p className="text-sm text-gray-800 bg-green-50 p-3 rounded-lg leading-relaxed">
                                        {qa.a}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {call.summary && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-2">
                            Call Summary
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {call.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Ticket Summary */}
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Ticket Summary
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ticket.summary || "No summary provided"}
                </p>
              </div>

              {/* Proposed Solution */}

              <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Proposed Solution
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ticket.proposedSolution}
                </p>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Send Email Form */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Email
                </h3>
                <form onSubmit={handleSendEmail}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        To
                      </label>
                      <input
                        type="text"
                        value={ticket.User?.email || "N/A"}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-sm text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Enter email subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Enter your email message"
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        required
                      />
                    </div>

                    <Button
                      fullWidth
                      type="submit"
                      size="md"
                      radius={"md"}
                      loading={isSending}
                      classNames={{
                        root: "!bg-blue-600 hover:!bg-blue-700 !text-white w-full",
                      }}
                    >
                      {isSending ? "Sending..." : "Send Email"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Ticket Notes */}
              <TicketNotes ticketId={id} />

              {/* Assigned Agent */}
              {ticket.Agent && (
                <div className="bg-green-50 shadow-sm border border-green-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Assigned Agent
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {ticket.Agent.firstName?.[0]}
                      {ticket.Agent.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {ticket.Agent.firstName} {ticket.Agent.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Support Agent</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
            {/* Customer Information */}
            <div className="bg-blue-50 shadow-sm border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Name
                  </p>
                  <p className="text-sm text-gray-900">
                    {ticket.User?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 break-all">
                    {ticket.User?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            <div className="bg-blue-50 shadow-sm border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
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
                Ticket Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Type
                  </p>
                  <p className="text-sm text-gray-900">
                    {ticket.ticketType || "General"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Priority
                  </p>
                  <p className="text-sm text-gray-900 capitalize">
                    {ticket.priority || "Medium"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Satisfaction
                  </p>
                  <p className="text-sm">
                    {ticket.isSatisfied === true ? (
                      <span className="text-green-600 flex items-center font-medium">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Satisfied
                      </span>
                    ) : ticket.isSatisfied === false ? (
                      <span className="text-red-600 flex items-center font-medium">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Not Satisfied
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Not Rated
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="bg-blue-50 shadow-sm border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Created
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
