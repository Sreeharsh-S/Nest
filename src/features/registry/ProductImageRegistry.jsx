import React from 'react';

export default function ProductImageRegistry({ productsRegistry, setProductsRegistry, styles }) {

  // Handler 1: Update an existing component's snapshot image
  const handleEditImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const customUrl = URL.createObjectURL(file);
      setProductsRegistry(prev => prev.map(item => 
        item.orderNo === id ? { ...item, imageSrc: customUrl } : item
      ));
    }
  };

  // Handler 2: Add single item by picking image first, then naming it
  const handleSingleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Immediately ask the user for the item name after file selection
    const itemName = prompt("Enter the name/ID for this single item:");
    
    // If user cancelled or left it blank, abort
    if (!itemName || !itemName.trim()) {
      event.target.value = ""; // clear selector
      return;
    }

    const formattedId = itemName.trim().toUpperCase();

    // Guard clause against duplicates
    if (productsRegistry.some(item => item.orderNo === formattedId)) {
      alert(`Item "${formattedId}" is already registered in the master list.`);
      event.target.value = "";
      return;
    }

    // 2. Generate the temporary local URL link for the picked image asset
    const customUrl = URL.createObjectURL(file);

    // 3. Commit straight to state database array
    setProductsRegistry(prev => [...prev, {
      orderNo: formattedId,
      desc: "Manually Initialized Node Component",
      qty: 1,
      imageSrc: customUrl,
      partType: "Assembled part",
      checklist: "QA/QC Bound",
      status: "Verified",
      remarks: "Logged successfully."
    }]);

    event.target.value = ""; // Reset selector buffer
  };

  // Handler 3: Extract bulk lines from uploaded CSV / Excel format structures
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = e.target.result;
      const rowLines = textContent.split(/\r?\n/);
      const freshlyParsedItems = [];

      rowLines.forEach((row) => {
        const cleanRow = row.trim();
        if (!cleanRow) return;

        const columns = cleanRow.split(/[,\t]/);
        const codeKey = columns[0].trim().toUpperCase();

        if (
          codeKey && 
          codeKey !== "SI NO" && 
          codeKey !== "ITEM" && 
          codeKey !== "ORDERNO" &&
          !productsRegistry.some(item => item.orderNo === codeKey) &&
          !freshlyParsedItems.some(item => item.orderNo === codeKey)
        ) {
          freshlyParsedItems.push({
            orderNo: codeKey,
            desc: "Excel Imported Core Component Asset Block",
            qty: 1,
            imageSrc: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=120",
            partType: "Assembled part",
            checklist: "QA/QC Bound",
            status: "Verified",
            remarks: "Imported via bulk file upload parser system."
          });
        }
      });

      if (freshlyParsedItems.length > 0) {
        setProductsRegistry(prev => [...prev, ...freshlyParsedItems]);
        alert(`Successfully imported ${freshlyParsedItems.length} new node elements.`);
      } else {
        alert("No valid, unique new structural item IDs found inside the file.");
      }
    };

    reader.readAsText(file);
    event.target.value = ""; 
  };

  return (
    <div style={styles.panel}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#0f172a" }}>Master Data</h3>
      </div>

      <table style={{ ...styles.table, marginBottom: "24px" }}>
        <thead>
          <tr style={styles.thRow}>
            <th style={{ ...styles.th, width: "80px" }}>SI No</th>
            <th style={styles.th}>Image</th>
            <th style={{ ...styles.th, textAlign: "center", width: "200px" }}>Edit Image</th>
          </tr>
        </thead>
        <tbody>
          {productsRegistry.map((item, idx) => (
            <tr key={idx} style={styles.tr}>
              <td style={{ ...styles.td, fontWeight: "600", color: "#64748b" }}>{idx + 1}</td>
              <td style={styles.td}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img src={item.imageSrc} alt={item.orderNo} style={{ height: "40px", width: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid #cbd5e1" }} />
                  <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: "700", color: "#0f172a" }}>
                    {item.orderNo}.png
                  </span>
                </div>
              </td>
              <td style={{ ...styles.td, textAlign: "center" }}>
                <label style={{ padding: "6px 12px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "4px", backgroundColor: "#f8fafc", cursor: "pointer", fontWeight: "600", display: "inline-block" }}>
                  Upload New Image
                  <input type="file" accept="image/*" onChange={(e) => handleEditImageUpload(item.orderNo, e)} style={{ display: "none" }} />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ACTION TRIGGER INTERFACES */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        {/* BUTTON 2: Add item via excel format sheet drop */}
        <label style={{ padding: "10px 20px", backgroundColor: "#475569", color: "#ffffff", fontWeight: "600", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
          Add Item as File (.csv / .txt)
          <input type="file" accept=".csv, .txt, .xlsx" onChange={handleExcelUpload} style={{ display: "none" }} />
        </label>

        {/* BUTTON 1: Add item as a single (Now launches file manager immediately) */}
        <label style={{ padding: "10px 20px", backgroundColor: "#0f172a", color: "#ffffff", fontWeight: "600", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
          Add Item as Single
          <input type="file" accept="image/*" onChange={handleSingleImageUpload} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  );
}