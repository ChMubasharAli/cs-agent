import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Badge } from "@mantine/core";
import apiClient from "../api/axios";
import LoaderComp from "./LoaderComp";
import Audio from "./Audio";
import CustomerSatisfactionToggler from "./CustomerSatisfactionToggler";
// import Audio from "../components/Audio";

const CallDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate("");

  const {
    data: call = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["call", id],
    queryFn: () =>
      apiClient.get(`/api/call/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });

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
        <LoaderComp />
        <p className="mt-4 text-gray-500">Loading call details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Call Not Found
        </p>
        <p className="text-gray-500 mb-4">{error.message}</p>

        <Button
          onClick={() => {
            navigate(-1);
          }}
          classNames={{ root: "!bg-blue-600 hover:!bg-blue-700" }}
        >
          Back to Calls
        </Button>
      </div>
    );

  return (
    <div className="  bg-white bgwhite py-8 shadow-lg rounded-xl shadow-md">
      {/* Header with Back Button */}

      {/* Main Card */}
      <div className="container mx-auto bg-white  overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Call #{call.id}
              </h1>
              <p className="text-gray-600">
                Complete call details and conversation transcript
              </p>
            </div>
            <div className="max-w-xs w-full">
              <CustomerSatisfactionToggler
                callId={call.id}
                initialSatisfied={call.customerSatisfied}
                switchSize="xl"
                textSize="base"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2   flex flex-col gap-10">
              {/* Conversation Transcript */}
              {call.QuestionsAnswers && call.QuestionsAnswers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Conversation Transcript
                    <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {call.QuestionsAnswers.length} exchanges
                    </span>
                  </h2>
                  <div className="space-y-3 shadow-md p-2 rounded-md min-h-96 max-h-96 overflow-y-auto">
                    {call.QuestionsAnswers.map((qa, qaIndex) => (
                      <div key={qaIndex} className="space-y-2">
                        {qa.q && (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Customer Question
                              </p>
                              <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg">
                                {qa.q}
                              </p>
                            </div>
                          </div>
                        )}
                        {qa.a && (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Agent Response
                              </p>
                              <p className="text-sm text-gray-800 bg-green-50 p-3 rounded-lg">
                                {qa.a}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call Summary */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                  Call Summary
                </h2>
                <div className="flex items-start justify-between">
                  <p className="text-gray-700 leading-relaxed flex-1">
                    {call.summary || "No summary available for this call."}
                  </p>
                  {call.isResolvedByAi && (
                    <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                      AI Generated
                    </span>
                  )}
                </div>
              </div>

              {/* Outbound Details */}
              {/* {call.outboundDetails && (
                <div className=" border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Outbound Details
                  </h2>
                  <pre className="text-orange-800 text-sm whitespace-pre-wrap bg-orange-100 p-3 rounded-lg">
                    {JSON.stringify(call.outboundDetails, null, 2)}
                  </pre>
                </div>
              )} */}

              {/* No Transcript State */}
              {(!call.QuestionsAnswers ||
                call.QuestionsAnswers.length === 0) && (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Transcript Available
                  </h3>
                  <p className="text-gray-600">
                    The conversation transcript for this call is not available.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="flex flex-col justify-between">
              {/* Call Recording */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                      d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3zm6 10a6 6 0 01-12 0M12 19v4m-4 0h8"
                    />
                  </svg>
                  Call Recording
                </h3>
                <div className="space-y-3">
                  <Audio callId={call.id} />
                </div>
              </div>

              {/* Languages */}
              {call.languages && call.languages.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {call.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Information */}
              <div className="bg-green-50 shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                    <p className="text-xs font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(call.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(call.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="grid grid-cols-1 gap-6 mt-8  lg:grid-cols-2">
            {/* Customer Information */}
            {call.userId && (
              <div className="bg-blue-50 shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                    <p className="text-xs font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">
                      {call.userId.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 break-all">
                      {call.userId.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {call.userId.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Call Information */}
            <div className="bg-blue-50 shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Details
              </h3>
              <div className="space-y-3">
                {/* Add Customer Satisfaction Toggler here */}

                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {call.type || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    AI Resolution
                  </p>
                  <p className="text-sm text-gray-900">
                    {call.isResolvedByAi ? (
                      <span className="text-green-600 flex items-center">
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
                        Resolved by AI
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pending Resolution
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Ticket ID</p>
                  <p className="text-sm text-gray-900">
                    {call.ticketId || "Not Linked"}
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

export default CallDetails;
