import React from "react";

export default function MetricsRow({ masterTickets, statusFilter, setStatusFilter, styles }) {
  const total = masterTickets.length;
  const open = masterTickets.filter((t) => t.status === "Open").length;
  const closed = masterTickets.filter((t) => t.status === "Closed").length;

  const getCardStyle = (type) => ({
    ...styles.metricCard,
    cursor: "pointer",
    border: statusFilter === type ? "2px solid #0284c7" : "1px solid #e2e8f0",
    backgroundColor: statusFilter === type ? "#f0f9ff" : "#ffffff",
  });

  return (
    <div style={styles.metricsRow}>
      {/* Total State Frame */}
      <div style={getCardStyle("All")} onClick={() => setStatusFilter("All")}>
        <div style={styles.metricLabel}>Total Tickets</div>
        <div style={styles.metricVal}>{total}</div>
      </div>

      {/* Open State Frame */}
      <div style={getCardStyle("Open")} onClick={() => setStatusFilter("Open")}>
        <div style={styles.metricLabel}>Open</div>
        <div style={{ ...styles.metricVal, color: "#dc2626" }}>{open}</div>
      </div>

      {/* Closed State Frame */}
      <div style={getCardStyle("Closed")} onClick={() => setStatusFilter("Closed")}>
        <div style={styles.metricLabel}>Closed</div>
        <div style={{ ...styles.metricVal, color: "#16a34a" }}>{closed}</div>
      </div>
    </div>
  );
}