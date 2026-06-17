import React, { useState } from "react";

export default function CreateTicketDashboard({ productsRegistry, onSaveTicket, onCancel, styles }) {
  const [orderId, setOrderId] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inspectorRemarks, setInspectorRemarks] = useState("");
  const [compiledItems, setCompiledItems] = useState([]);

  // 5-point state matrix mapping directly to image_3e523f.png
  const [checkpointSelections, setCheckpointSelections] = useState([false, false, false, false, false]);

  const checkPointsList = [
    "Ensure there is no sharp edges",
    "Ensure the finishing appearance is good",
    "Ensure the modules and parts listed in the packing list fully account",
    "Ensure all loose parts are secured in a single dedicated box",
    "Ensure no FOD/Dirt on the unit"
  ];

  const handleCheckboxToggle = (index) => {
    const updated = [...checkpointSelections];
    updated[index] = !updated[index];
    setCheckpointSelections(updated);
  };

  const handleAddItem = () => {
    const baseProduct = productsRegistry[selectedProductIndex];
    
    // Fallback to true if all points are explicitly checked
    const allChecked = checkpointSelections.every(status => status === true);

    const newItem = {
      uid: `i-${Math.random().toString(36).substr(2, 5)}`,
      modelNo: baseProduct.orderNo,
      desc: baseProduct.desc,
      qty: parseInt(quantity, 10),
      partType: baseProduct.partType || "Assembled part",
      imageSrc: baseProduct.imageSrc,
      checkpoints: [...checkpointSelections], 
      qcChecked: allChecked,
      checklist: allChecked ? "Verified" : "Rejected",
      remarks: inspectorRemarks
    };

    setCompiledItems([...compiledItems, newItem]);
    setQuantity(1);
    setInspectorRemarks("");
    setCheckpointSelections([false, false, false, false, false]);
  };

  return (
    <div style={styles.panel}>
      <h3 style={{ margin: "0 0 24px 0", color: "#0f172a" }}>Generate Manufacturing Work Order Ledger</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div>
          <label style={styles.fieldLabel}>Generated Order Tracking ID</label>
          <input type="text" value={orderId} readOnly style={{ ...styles.textInput, backgroundColor: "#f1f5f9", cursor: "not-allowed" }} />
        </div>
        <div>
          <label style={styles.fieldLabel}>Select Target Hardware Model Asset</label>
          <select value={selectedProductIndex} onChange={(e) => setSelectedProductIndex(e.target.value)} style={{ ...styles.textInput, maxWidth: "none" }}>
            {productsRegistry.map((p, idx) => (
              <option key={p.orderNo} value={idx}>{p.orderNo} — {p.desc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Grid Matrix mapping from image_3e523f.png */}
      <div style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "20px", marginBottom: "24px", backgroundColor: "#f8fafc" }}>
        <h4 style={{ margin: "0 0 14px 0", color: "#334155", fontSize: "14px" }}>Active Item Quality Control Inspection Grid</h4>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={styles.fieldLabel}>Lot Item Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={styles.textInput} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={styles.fieldLabel}>Physical Unit Checklist Clearance</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
            {checkPointsList.map((checkpoint, idx) => (
              <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={checkpointSelections[idx]} 
                  onChange={() => handleCheckboxToggle(idx)}
                  style={{ marginTop: "3px", cursor: "pointer" }}
                />
                <span><strong>SL #{idx + 1}:</strong> {checkpoint}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={styles.fieldLabel}>Inspector Assessment Findings / Remarks</label>
          <input type="text" placeholder="e.g., Solder structures immaculate" value={inspectorRemarks} onChange={(e) => setInspectorRemarks(e.target.value)} style={{ ...styles.textInput, maxWidth: "none" }} />
        </div>

        <button type="button" onClick={handleAddItem} style={{ ...styles.submitButton, backgroundColor: "#0284c7" }}>
          Commit Item to Batch List
        </button>
      </div>

      {compiledItems.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Staged Batch Sub-Components Table ({compiledItems.length})</h4>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Model</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Overall Verdict</th>
                <th style={styles.th}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {compiledItems.map((item, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>{item.modelNo}</td>
                  <td style={styles.td}>{item.qty} units</td>
                  <td style={{ ...styles.td, fontWeight: "700", color: item.qcChecked ? "#16a34a" : "#dc2626" }}>{item.checklist}</td>
                  <td style={styles.td}>{item.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ ...styles.paginationButton, padding: "10px 20px" }}>Cancel</button>
        <button type="button" disabled={compiledItems.length === 0} onClick={() => onSaveTicket(orderId, compiledItems)} style={{ ...styles.submitButton, opacity: compiledItems.length === 0 ? 0.5 : 1, cursor: compiledItems.length === 0 ? "not-allowed" : "pointer" }}>
          Finalize & Dispatch Work Order
        </button>
      </div>
    </div>
  );
}