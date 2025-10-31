import React from "react";
import Tickets from "../admin/Tickets";
import { useSelector } from "react-redux";
export default function AgentTickets() {
  const { id } = useSelector((state) => state.auth.userData);
  return (
    <Tickets apiKey={`/api/agents/${id}/tickets`} route="/agent/tickets" />
  );
}
