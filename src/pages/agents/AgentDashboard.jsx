import {
  Ticket,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  Award,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LoaderComp } from "../../components";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import { Link } from "react-router-dom";

export default function AgentDashboard() {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  // Fetch Agent Dashboard Data using TanStack Query
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: () => {
      return apiClient
        .get(`/api/dashboard?role=agent&agentId=${userData.id}`)
        .then((response) => response.data);
    },
    enabled: !!userData.id, // Only run the query if userData.id is available
  });

  // Stats cards configuration for user
  const getStatsCards = (summary) => [
    {
      title: "Total Tickets",
      value: summary.tickets.total,
      today: summary.tickets.today,
      icon: Ticket,
      color: "from-[#3b82f6] to-[#2563eb]",
      bgColor: "bg-[#3b82f6]/10",
      iconColor: "text-[#3b82f6]",
      url: "/agent/tickets",
    },
    {
      title: "Total Calls",
      value: summary.calls.total,
      today: summary.calls.today,
      icon: Phone,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      url: "/agent/calls",
    },
    {
      title: "Inbound Calls",
      value: summary.calls.inbound.total,
      today: summary.calls.inbound.today,
      icon: PhoneIncoming,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      url: "/agent/calls",
    },
    {
      title: "Outbound Calls",
      value: summary.calls.outbound.total,
      today: summary.calls.outbound.today,
      icon: PhoneOutgoing,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
      url: "/agent/calls",
    },
  ];

  return (
    <>
      <main className="py-4">
        {isLoading ? (
          <LoaderComp />
        ) : error ? (
          <Text py={"md"} ta={"center"} c={"red"}>
            Failed to load Data: {error.message}
          </Text>
        ) : !dashboardData ? (
          <Text py={"md"} ta={"center"}>
            No Data found.
          </Text>
        ) : (
          <section className="h-full bg-white rounded-2xl p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#002046]">
                    My Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back! Here's your personal performance overview.
                  </p>
                </div>
                {dashboardData.scope && (
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 capitalize">
                      {dashboardData.scope.role} #{dashboardData.scope.agentId}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Cards Grid - Removed Users card */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getStatsCards(dashboardData.summary).map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Link
                      to={stat.url || "#"}
                      key={index}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                          </div>
                          {stat.today > 0 && (
                            <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-semibold text-green-600">
                                +{stat.today}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-medium mb-1">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold text-[#002046]">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-1 bg-gradient-to-r ${stat.color}`}
                      ></div>
                    </Link>
                  );
                })}
              </div>

              {/* Charts and Performance Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Call Activity Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#002046] mb-1">
                      My Call Activity (Last 7 Days)
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Track your inbound and outbound calls
                    </p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.timeseries7d}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inbound"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="My Inbound Calls"
                      />
                      <Line
                        type="monotone"
                        dataKey="outbound"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: "#f97316", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="My Outbound Calls"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="My Total Calls"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* My Performance */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-6">
                    <Award className="w-6 h-6 text-[#4bb22f]" />
                    <h2 className="text-xl font-bold text-[#002046]">
                      My Performance
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {/* Current User's Stats */}
                    {dashboardData.topAgents
                      .filter(
                        (agent) =>
                          agent.agentId === dashboardData.scope?.agentId
                      )
                      .map((agent) => (
                        <div key={agent.agentId} className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                              {agent.avg.toFixed(1)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#002046]">
                            {agent.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            {agent.email}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-[#002046]">
                                {agent.avg.toFixed(1)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Avg Rating
                              </p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-[#002046]">
                                {agent.count}
                              </p>
                              <p className="text-xs text-gray-500">Tickets</p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Top Agents Ranking (if current user is not in top agents) */}
                    {dashboardData.topAgents.filter(
                      (agent) => agent.agentId === dashboardData.scope?.agentId
                    ).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          Performance data not available
                        </p>
                      </div>
                    )}

                    {/* Leaderboard Preview */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Top Performers
                      </h4>
                      <div className="space-y-2">
                        {dashboardData.topAgents
                          .slice(0, 3)
                          .map((agent, index) => (
                            <div
                              key={agent.agentId}
                              className={`flex items-center space-x-3 p-2 rounded-lg ${
                                agent.agentId === dashboardData.scope?.agentId
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index === 0
                                    ? "bg-yellow-400 text-white"
                                    : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                    ? "bg-orange-400 text-white"
                                    : "bg-blue-500 text-white"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {agent.name}
                                  {agent.agentId ===
                                    dashboardData.scope?.agentId && (
                                    <span className="text-blue-600 text-xs ml-1">
                                      (You)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="text-sm font-bold text-gray-700">
                                {agent.avg.toFixed(1)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#4bb22f] to-[#3d9625] rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      My Call Success Rate
                    </h3>
                    <Phone className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {dashboardData.summary.calls.total > 0
                      ? (
                          (dashboardData.summary.calls.inbound.total /
                            dashboardData.summary.calls.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p className="text-sm opacity-90">Inbound vs Total Calls</p>
                </div>

                <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">My Average Rating</h3>
                    <Award className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {dashboardData.topAgents
                      .find(
                        (agent) =>
                          agent.agentId === dashboardData.scope?.agentId
                      )
                      ?.avg.toFixed(1) || "0.0"}
                  </p>
                  <p className="text-sm opacity-90">
                    Based on customer feedback
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">My Activity Today</h3>
                    <TrendingUp className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {dashboardData.summary.tickets.today +
                      dashboardData.summary.calls.today}
                  </p>
                  <p className="text-sm opacity-90">Tickets & Calls Today</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
