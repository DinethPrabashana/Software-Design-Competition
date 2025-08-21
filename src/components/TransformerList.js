import React from "react";

function TransformerList({ transformers, onDelete, onEdit }) {
  return (
    <div className="list transformer-list">
      <h2>Transformer Records</h2>
      {transformers.length === 0 ? (
        <p>No transformers added yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Region</th>
                <th>Transformer No.</th>
                <th>Pole No.</th>
                <th>Type</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transformers.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.region || "-"}</td>
                  <td>{t.number || "-"}</td>
                  <td>{t.pole || "-"}</td>
                  <td>{t.type || "-"}</td>
                  <td>{t.location}</td>
                  <td className="action-buttons">
                    <button className="btn-edit" onClick={() => onEdit(t)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransformerList;
