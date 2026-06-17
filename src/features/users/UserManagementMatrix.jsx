import React from 'react';

export default function UserManagementMatrix({ styles }) {
  const workers = [
    { name: "Alok Kumar", email: "alok@natdc.org", role: "Quality Control Specialist", level: "QC Operations" },
    { name: "Sarah Jones", email: "sarah@natdc.org", role: "Quality Assurance Officer", level: "QA Clearance Gate" },
    { name: "Technician Lead", email: "engineer@natdc.org", role: "Hardware Engineer", level: "Line Management" }
  ];

  return (
    <div style={styles.panel}>
      <h3 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>Personnel Security Matrices</h3>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>Management nodes mapping structural clearance levels across terminals.</p>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>Operator Signature</th>
            <th style={styles.th}>Communication Endpoint</th>
            <th style={styles.th}>Designated Profile</th>
            <th style={styles.th}>Operations Scope</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w, index) => (
            <tr key={index} style={styles.tr}>
              <td style={{ ...styles.td, fontWeight: "600", color: "#0f172a" }}>{w.name}</td>
              <td style={{ ...styles.td, fontFamily: "monospace" }}>{w.email}</td>
              <td style={styles.td}>{w.role}</td>
              <td style={styles.td}><span style={{ backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", border: "1px solid #e2e8f0" }}>{w.level}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}