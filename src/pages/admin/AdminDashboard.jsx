import {
  Users,
  Ticket,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  Award,
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

export default function AdminDashboard() {
  // Fetch Dashboard Data using TanStack Query
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => {
      return apiClient.get("/api/dashboard").then((response) => response.data);
    },
  });

  // Stats cards configuration
  const getStatsCards = (summary) => [
    {
      title: "Total Users",
      value: summary.users.total,
      today: summary.users.today,
      icon: Users,
      color: "from-[#4bb22f] to-[#3d9625]",
      bgColor: "bg-[#4bb22f]/10",
      iconColor: "text-[#4bb22f]",
      url: "/admin/users",
    },
    {
      title: "Total Tickets",
      value: summary.tickets.total,
      today: summary.tickets.today,
      icon: Ticket,
      color: "from-[#3b82f6] to-[#2563eb]",
      bgColor: "bg-[#3b82f6]/10",
      iconColor: "text-[#3b82f6]",
      url: "/admin/tickets",
    },
    {
      title: "Total Calls",
      value: summary.calls.total,
      today: summary.calls.today,
      icon: Phone,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      url: "/admin",
    },
    {
      title: "Inbound Calls",
      value: summary.calls.inbound.total,
      today: summary.calls.inbound.today,
      icon: PhoneIncoming,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      url: "/admin/inbound",
    },
    {
      title: "Outbound Calls",
      value: summary.calls.outbound.total,
      today: summary.calls.outbound.today,
      icon: PhoneOutgoing,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
      url: "/admin/outbound",
    },
  ];

  return (
    <>
      <main className="py-4   ">
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
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Here’s your daily overview — track progress and stay on top
                    of everything.
                  </p>
                </div>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

              {/* Charts and Top Agents Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Call Activity Chart - Takes 2 columns */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#002046] mb-1">
                      Call Activity (Last 7 Days)
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
                        name="Inbound Calls"
                      />
                      <Line
                        type="monotone"
                        dataKey="outbound"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: "#f97316", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Outbound Calls"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Total Calls"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Agents - Takes 1 column */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-6">
                    <Award className="w-6 h-6 text-[#4bb22f]" />
                    <h2 className="text-xl font-bold text-[#002046]">
                      Top Agents
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.topAgents.slice(0, 5).map((agent, index) => (
                      <div
                        key={agent.agentId}
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : index === 1
                                ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                : index === 2
                                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                : "bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#002046] truncate">
                            {agent.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {agent.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-bold text-[#002046]">
                              {agent.avg.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {agent.count} tickets
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#4bb22f] to-[#3d9625] rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Call Success Rate</h3>
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
                    <h3 className="text-lg font-semibold">Average Rating</h3>
                    <Award className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {dashboardData.topAgents.length > 0
                      ? (
                          dashboardData.topAgents.reduce(
                            (sum, agent) => sum + agent.avg,
                            0
                          ) / dashboardData.topAgents.length
                        ).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-sm opacity-90">Across All Agents</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Today</h3>
                    <TrendingUp className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    {dashboardData.summary.users.today +
                      dashboardData.summary.tickets.today +
                      dashboardData.summary.calls.today}
                  </p>
                  <p className="text-sm opacity-90">Total Activity Today</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
