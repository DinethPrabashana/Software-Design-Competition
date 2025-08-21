import React from "react";

/**
 * A simple printable record. Use browser Print (Ctrl/Cmd+P).
 */
function MaintenanceRecordView({ inspection, transformer, baselineImage }) {
  if (!inspection) return null;

  return (
    <div className="record">
      <h2>Maintenance Record</h2>
      <div className="record-grid">
        <div>
          <p><strong>Transformer:</strong> {transformer ? `${transformer.location} (${transformer.capacity} kVA)` : inspection.transformerId}</p>
          <p><strong>Date:</strong> {inspection.date}</p>
          <p><strong>Inspector:</strong> {inspection.inspector}</p>
          <p><strong>Status:</strong> {inspection.status}</p>
          <p><strong>Condition:</strong> {inspection.condition}</p>
          <p><strong>Notes:</strong> {inspection.notes || "-"}</p>
        </div>
        <div className="thumbs">
          {baselineImage && (
            <div>
              <div className="small-title">Baseline</div>
              <img src={baselineImage.dataUrl} alt="baseline" />
            </div>
          )}
          {inspection.maintenanceImage && (
            <div>
              <div className="small-title">Maintenance</div>
              <img src={inspection.maintenanceImage.dataUrl} alt="maintenance" />
            </div>
          )}
        </div>
      </div>

      <h3>Annotated Hotspots</h3>
      {(!inspection.annotations || inspection.annotations.length === 0) ? (
        <p>None</p>
      ) : (
        <table className="record-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Location (x%, y%)</th>
              <th>Radius %</th>
              <th>Severity</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {inspection.annotations.map((m, idx) => (
              <tr key={m.id}>
                <td>{idx + 1}</td>
                <td>({m.x.toFixed(1)}, {m.y.toFixed(1)})</td>
                <td>{m.radius}</td>
                <td>{m.severity}</td>
                <td>{m.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="print-hint">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
    </div>
  );
}

export default MaintenanceRecordView;
