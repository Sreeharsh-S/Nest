import React, { useState, useEffect } from "react";
import CreateTicketDashboard from "./features/tickets/CreateTicketDashboard";
import MetricsRow from "./features/dashboard/MetricsRow";
import MasterLedgerTable from "./features/dashboard/MasterLedgerTable";
import ProductImageRegistry from "./features/registry/ProductImageRegistry";
import UserManagementMatrix from "./features/users/UserManagementMatrix";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("qc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentDashboard, setCurrentDashboard] = useState("main");
  const [systemTime, setSystemTime] = useState(new Date().toISOString().replace('T', ' ').substring(0, 19));

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setSystemTime(new Date().toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, currentDashboard]);

  const [productsRegistry, setProductsRegistry] = useState([
    { orderNo: "ITM-902", desc: "High-Density PCB Module", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120", partType: "Assembled part" },
    { orderNo: "ITM-441", desc: "Transformer Copper Coil", imageSrc: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=120", partType: "Loosed part" }
  ]);

  // ==========================================
  // START OF HARDCODED DATA (DELETE/EDIT HERE)
  // ==========================================
  const [masterTickets, setMasterTickets] = useState([
    {
      orderNo: "ORD-7712",
      initiator: "inspector1@natdc.org",
      status: "Open",
      createTime: "2026-06-11 08:30:00",
      qaRemarks: "",
      items: [
        { uid: "i1", modelNo: "ITM-902", desc: "High-Density PCB Module", qty: 1, partType: "Assembled part", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120", qcChecked: true, checklist: "Verified", remarks: "Passed continuity checks" },
        { uid: "i2", modelNo: "ITM-441", desc: "Transformer Copper Coil", qty: 2, partType: "Loosed part", imageSrc: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=120", qcChecked: false, checklist: "Rejected", remarks: "Surface insulation scratch detected" }
      ]
    },
    {
      orderNo: "ORD-8821",
      initiator: "inspector2@natdc.org",
      status: "Closed",
      createTime: "2026-06-12 10:15:22",
      qaRemarks: "All components structurally verified and approved.",
      items: [
        { uid: "i3", modelNo: "ITM-902", desc: "High-Density PCB Module", qty: 5, partType: "Assembled part", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120", qcChecked: true, checklist: "Verified", remarks: "Passed comprehensive stress tolerance diagnostics." }
      ]
    },
    {
      orderNo: "ORD-1044",
      initiator: "inspector1@natdc.org",
      status: "Open",
      createTime: "2026-06-14 14:02:11",
      qaRemarks: "",
      items: [
        { uid: "i4", modelNo: "ITM-441", desc: "Transformer Copper Coil", qty: 10, partType: "Loosed part", imageSrc: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=120", qcChecked: true, checklist: "Verified", remarks: "Winding resistance falls within acceptable tolerances." }
      ]
    },
    {
      orderNo: "ORD-3312",
      initiator: "lead_tech@natdc.org",
      status: "Closed",
      createTime: "2026-06-15 09:45:00",
      qaRemarks: "Archived successfully.",
      items: [
        { uid: "i5", modelNo: "ITM-902", desc: "High-Density PCB Module", qty: 2, partType: "Assembled part", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120", qcChecked: true, checklist: "Verified", remarks: "Solder joints pristine." }
      ]
    },
    {
      orderNo: "ORD-5541",
      initiator: "inspector2@natdc.org",
      status: "Open",
      createTime: "2026-06-15 16:10:30",
      qaRemarks: "",
      items: [
        { uid: "i6", modelNo: "ITM-441", desc: "Transformer Copper Coil", qty: 3, partType: "Loosed part", imageSrc: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=120", qcChecked: false, checklist: "Rejected", remarks: "Core alignment defect noted." }
      ]
    },
    {
      orderNo: "ORD-9900",
      initiator: "inspector1@natdc.org",
      status: "Open",
      createTime: "2026-06-16 11:24:15",
      qaRemarks: "",
      items: [
        { uid: "i7", modelNo: "ITM-902", desc: "High-Density PCB Module", qty: 1, partType: "Assembled part", imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120", qcChecked: true, checklist: "Verified", remarks: "Thermal signatures verified within parameters." }
      ]
    }
  ]);
  // ==========================================
  // END OF HARDCODED DATA
  // ==========================================

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentDashboard("main");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setCurrentDashboard("main");
  };

  const handleSaveTicket = (orderId, compiledItemsList) => {
    const newOrderRecord = {
      orderNo: orderId,
      initiator: email,
      status: "Open",
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      qaRemarks: "",
      items: compiledItemsList
    };
    setMasterTickets([newOrderRecord, ...masterTickets]);
    setCurrentDashboard("main");
  };

  const handleQAAction = (orderNo, approve, remarks) => {
    setMasterTickets(prev => prev.map(order => 
      order.orderNo === orderNo ? { ...order, status: approve ? "Closed" : "Open", qaRemarks: remarks } : order
    ));
    alert(`Order ${orderNo} finalized.`);
  };

  const tabs = [
    { id: "main", label: "Data Dashboard", visible: true }, 
    { id: "my_tickets", label: "My Tickets", visible: userRole !== "admin" && userRole !== "engineer" },
    { id: "master_data", label: "Master Data", visible: userRole === "admin" || userRole === "engineer" },
    { id: "user_matrix", label: "User Management", visible: userRole === "admin" },
    { id: "qa_gate", label: "QA Verification Gate", visible: userRole !== "engineer" && userRole !== "master_data" },
  ];

  let filteredTickets = masterTickets.filter(t => {
    const matchesSearch = t.orderNo.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (currentDashboard === "my_tickets") {
    filteredTickets = filteredTickets.filter(t => t.initiator === email);
  }

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  if (!isLoggedIn) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "28px", fontWeight: "700" }}>NATDC</h2>
            <p style={{ margin: "0", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>Secure Core Terminal Access</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={styles.fieldLabel}>Authentication Clearance Role</label>
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={styles.loginSelect}>
                <option value="qc">Quality Control (QC) Inspector</option>
                <option value="engineer">Engineer Terminal</option>
                <option value="qa">Quality Assurance (QA) Authority</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
            <div>
              <label style={styles.fieldLabel}>Corporate Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@natdc.org" style={styles.loginInput} required />
            </div>
            <div>
              <label style={styles.fieldLabel}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={styles.loginInput} required />
            </div>
            <button type="submit" style={styles.submitButton}>Verify Identity</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appWrapper}>
      <header style={styles.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", height: "100%" }}>
          <span style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>NATDC</span>
          
          <nav style={{ display: "flex", height: "100%", gap: "4px" }}>
            {tabs.filter(t => t.visible).map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentDashboard(tab.id)}
                style={{
                  ...styles.tabItem,
                  borderBottom: currentDashboard === tab.id ? "3px solid #0284c7" : "3px solid transparent",
                  color: currentDashboard === tab.id ? "#0284c7" : "#64748b",
                  fontWeight: currentDashboard === tab.id ? "700" : "500",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={styles.userProfileBadge}>
            <div style={{ color: "#334155", fontWeight: "600" }}>{email}</div>
            <div style={{ color: "#64748b" }}>Role: {userRole.toUpperCase()}</div>
            <div style={{ color: "#0284c7" }}>{systemTime}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <main style={styles.contentArea}>
        {(currentDashboard === "main" || currentDashboard === "my_tickets") && (
          <div>
            <MetricsRow 
              masterTickets={currentDashboard === "my_tickets" ? masterTickets.filter(t => t.initiator === email) : masterTickets} 
              statusFilter={statusFilter} 
              setStatusFilter={setStatusFilter} 
              styles={styles} 
            />
            
            <div style={{ display: "flex", justifyContent: "space-between", margin: "24px 0 16px 0", alignItems: "center" }}>
              <input type="text" placeholder="Search by work order id..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.textInput} />
              {(userRole === "qc" || userRole === "admin") && (
                <button onClick={() => setCurrentDashboard("create_ticket")} style={styles.submitButton}>+ Generate New Work Order</button>
              )}
            </div>

            <MasterLedgerTable filteredTickets={paginatedTickets} styles={styles} />

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
        )}

        {currentDashboard === "create_ticket" && <CreateTicketDashboard productsRegistry={productsRegistry} onSaveTicket={handleSaveTicket} onCancel={() => setCurrentDashboard("main")} styles={styles} />}
        {currentDashboard === "master_data" && <ProductImageRegistry productsRegistry={productsRegistry} setProductsRegistry={setProductsRegistry} styles={styles} />}
        {currentDashboard === "user_matrix" && <UserManagementMatrix styles={styles} />}
        {currentDashboard === "qa_gate" && <QAGateView masterTickets={masterTickets} onQAAction={handleQAAction} styles={styles} />}
      </main>
    </div>
  );
}

function QAGateView({ masterTickets, onQAAction, styles }) {
  const [decisionRemarks, setDecisionRemarks] = useState({});
  const pendingOrders = masterTickets.filter(t => t.status === "Open");
  
  return (
    <div style={styles.panel}>
      <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>QA Final Clearance Gate</h3>
      {pendingOrders.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No batches awaiting confirmation.</div> : 
        pendingOrders.map((order) => (
          <div key={order.orderNo} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
              <span style={{ fontWeight: "700" }}>Batch: {order.orderNo}</span>
              <span style={{ color: "#2563eb", fontWeight: "600" }}>Status: {order.status}</span>
            </div>
            <table style={{ ...styles.table, marginBottom: "16px" }}>
              <thead><tr style={styles.thRow}><th style={styles.th}>Model</th><th style={styles.th}>Desc</th><th style={styles.th}>Qty</th><th style={styles.th}>QC Check</th><th style={styles.th}>Inspector Remarks</th></tr></thead>
              <tbody>{order.items.map((item, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>{item.modelNo}</td><td style={styles.td}>{item.desc}</td><td style={styles.td}>{item.qty}</td>
                  <td style={{ ...styles.td, fontWeight: "700", color: item.qcChecked ? "#16a34a" : "#dc2626" }}>{item.checklist}</td>
                  <td style={styles.td}>{item.remarks}</td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="QA Remarks" value={decisionRemarks[order.orderNo] || ""} onChange={(e) => setDecisionRemarks({...decisionRemarks, [order.orderNo]: e.target.value})} style={styles.textInput} />
              <button onClick={() => onQAAction(order.orderNo, true, decisionRemarks[order.orderNo])} style={{ ...styles.submitButton, backgroundColor: "#16a34a" }}>Approve</button>
              <button onClick={() => onQAAction(order.orderNo, false, decisionRemarks[order.orderNo])} style={{ ...styles.submitButton, backgroundColor: "#ef4444" }}>Reject</button>
            </div>
          </div>
      ))}
    </div>
  );
}

const styles = {
  appWrapper: { minHeight: "100vh", backgroundColor: "#f8fafc", color: "#334155", fontFamily: 'sans-serif' },
  loginPage: { minHeight: "100vh", backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center" },
  loginCard: { width: "420px", backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  topBar: { height: "70px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 },
  tabItem: { height: "100%", padding: "0 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", transition: "all 0.15s" },
  userProfileBadge: { display: "flex", flexDirection: "column", fontSize: "11px", fontFamily: "monospace", textAlign: "right" },
  logoutButton: { padding: "6px 14px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", color: "#475569", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  contentArea: { padding: "32px" },
  fieldLabel: { display: "block", fontSize: "11px", textTransform: "uppercase", color: "#475569", fontWeight: "700", marginBottom: "6px" },
  textInput: { width: "100%", maxWidth: "340px", padding: "10px 14px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", color: "#0f172a" },
  loginInput: { width: "100%", padding: "12px 14px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", color: "#000000" },
  loginSelect: { width: "100%", padding: "12px 14px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", color: "#000000", cursor: "pointer" },
  submitButton: { padding: "10px 20px", backgroundColor: "#0f172a", border: "none", color: "#ffffff", fontWeight: "600", borderRadius: "6px", cursor: "pointer" },
  panel: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" },
  metricsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" },
  metricCard: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "18px" },
  metricLabel: { fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" },
  metricVal: { fontSize: "26px", fontWeight: "700", marginTop: "4px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "14px 16px", fontSize: "12px", color: "#475569", fontWeight: "700", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "14px 16px", fontSize: "13px", color: "#334155" },
  paginationRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "12px 4px" },
  paginationButton: { padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "4px", backgroundColor: "#ffffff", color: "#334155", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.1s ease" }
};