import React, { useState } from "react";

export default function MasterLedgerTable({ filteredTickets, styles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Calculations
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div style={styles.panel}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Work Order ID</th>
              <th style={styles.th}>Initiator</th>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Items Count</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No records matching active search filters found.
                </td>
              </tr>
            ) : (
              paginatedTickets.map((ticket) => (
                <tr key={ticket.orderNo} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#0f172a" }}>{ticket.orderNo}</td>
                  <td style={styles.td}>{ticket.initiator}</td>
                  <td style={{ ...styles.td, fontFamily: "monospace" }}>{ticket.createTime}</td>
                  <td style={styles.td}>{ticket.items.length} units</td>
                  <td style={{
                    ...styles.td,
                    fontWeight: "700",
                    color: ticket.status === "Closed" ? "#16a34a" : "#dc2626"
                  }}>
                    {ticket.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={styles.paginationRow}>
        <span style={{ fontSize: "13px", color: "#64748b" }}>
          Showing {filteredTickets.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} orders
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{ ...styles.paginationButton, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                ...styles.paginationButton,
                backgroundColor: currentPage === idx + 1 ? "#0f172a" : "#f1f5f9",
                color: currentPage === idx + 1 ? "#ffffff" : "#475569",
                borderColor: currentPage === idx + 1 ? "#0f172a" : "#cbd5e1"
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{ ...styles.paginationButton, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}